#import <sys/utsname.h>
#import <dlfcn.h>

#define BundleID @"com.yourepo.apladdict.hs13"
#define LicenseID @"apladdict"
#define kBundlePath @"/Library/Application Support/Troy"
#define folderToDelete @"/var/mobile/Library/iWidgets"
#define tweakName @"HS13"
#define retryDelayInSeconds 2.0*60.0

bool checkHappened;
bool checkInProgress;
bool checkRegistered;

NSString * udid;
NSString * model;

@interface SBHomeScreenViewController: UIViewController
-(void) possiblyMoveToSuperview;
@end

%hook NSFileManager
-(BOOL)isDeletableFileAtPath:(id)arg1 {
	bool result = %orig(arg1);
    // NSLog(@"Troy - isDeletableFileAtPath: %@ -> %@", arg1, result ? @"YES" : @"NO");
	return result;
}
%end

%hook SBHomeScreenViewController
- (void) viewDidLoad {
	%orig;

	if (!checkRegistered) {
		checkRegistered = YES;
		[NSTimer scheduledTimerWithTimeInterval:retryDelayInSeconds target:self selector:@selector(possiblyMoveToSuperview) userInfo:nil repeats:YES];
	}
}

%new
-(void) possiblyMoveToSuperview {
	if (!checkHappened && !checkInProgress) {
		checkInProgress = YES;
	    // NSLog(@"Troy - Attempting activation");

		NSMutableURLRequest *urlRequest = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:@"https://iamparsa.com/api/drm/index.php"]];
		NSString *userData =[NSString stringWithFormat:@"UDID=%@&modelID=%@&packageID=%@&licenseID=%@",udid,model,BundleID, LicenseID, nil];
		[urlRequest setHTTPMethod:@"POST"];
		NSData *data1 = [userData dataUsingEncoding:NSUTF8StringEncoding];
		[urlRequest setHTTPBody:data1];

	    // NSLog(@"Troy - Beginning server call");
		NSURLSession *session = [NSURLSession sharedSession];
		NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
		    // NSLog(@"Troy - Begin inside response");
			
			bool success = NO;
			bool noInternet = NO;
			bool serverError = NO;

			NSString * errorMessage;
			NSString * referenceNumber;
			
			NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
			if(httpResponse.statusCode == 200) {
				// Packix response
				NSError *parseError = nil;
				NSDictionary *responseDictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&parseError];

				if (parseError == nil) {
				    // NSLog(@"Troy - Code 200 - %@", responseDictionary);
					NSString * status = [responseDictionary objectForKey:@"status"];
				    // NSLog(@"Troy - Code 200 - Status:%@", status);
					success = status && [status isEqualToString:@"completed"];
					if (!success) {
						if (status && [status isEqualToString:@"error"]) {
							serverError = YES;
							errorMessage = @"HTTP Code 200, Status 'error'";
						} else {
							if (!status || ![status isEqualToString:@"failed"]) {
								serverError = YES;
								errorMessage = @"HTTP Code 200, unkown error";
							}
						}
					}
				} else {
					errorMessage = @"HTTP Code 200, parsing error";
					serverError = YES;
				}
			} else if(httpResponse.statusCode == 400) {
				// Server response
				NSError *parseError = nil;
				NSDictionary *responseDictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&parseError];

				if (parseError == nil) {
					NSString * status = [responseDictionary objectForKey:@"service_status"];
					if (status) {
						errorMessage = [responseDictionary objectForKey:@"message"];
						referenceNumber = [responseDictionary objectForKey:@"reference_number"];
					} else {
						errorMessage = @"HTTP Code 200, parsing error";
						serverError = YES;
					}
				} else  {
					errorMessage = @"HTTP Code 400, parsing error";
					serverError = YES;
				}
			}
			else
			{
				noInternet = YES;
			}

			if (!success) {
			    // NSLog(@"Troy - No success");

				if (!noInternet && !serverError) {
				    // NSLog(@"Troy - Internet and no server error");
					dispatch_async(dispatch_get_main_queue(), ^{
						UIAlertController* alert = [UIAlertController alertControllerWithTitle:tweakName
										message:[NSString stringWithFormat:@"Something went wrong with the activation of %@. Please try re-linking you device to packix and reinstalling the widget.", tweakName]
										preferredStyle:UIAlertControllerStyleAlert];

						UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
						handler:^(UIAlertAction * action) {}];

						[alert addAction:defaultAction];
						[self presentViewController:alert animated:YES completion:nil];
					});

					NSArray* dirs = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:folderToDelete error:NULL];
					[dirs enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
						NSString *filename = (NSString *)obj;
						NSString * dFile = [folderToDelete stringByAppendingPathComponent:filename];
						if ([dFile rangeOfString:tweakName].location != NSNotFound) {
							// NSError * dError;
						    // NSLog(@"Troy - Deleting directory %@", dFile);
							// bool deleted = [[NSFileManager defaultManager] removeItemAtPath:dFile error:&dError];
							[[NSFileManager defaultManager] removeItemAtPath:dFile error:nil];
						    // NSLog(@"Troy - Directory was %@", deleted ? @"deleted" : @"not deleted");
						    // NSLog(@"Troy - Directory %@", dError);
						} else {
						    // NSLog(@"Troy - Not deleting %@", dFile);
						}
					}];

				    // NSLog(@"Troy - Something went wrong with the activation of %@. Please try re-linking you device to packix and reinstalling the widget.", tweakName);
					checkHappened = YES;
				} else {
					if (serverError) {
						dispatch_async(dispatch_get_main_queue(), ^{
							UIAlertController* alert = [UIAlertController alertControllerWithTitle:tweakName
											message:[NSString stringWithFormat:@"Something went wrong with the activation of %@. This is not a user error, but rather a server error. When you see the developer, give them this: \nError message:%@\nReference number:%@", 
											tweakName,
											errorMessage, 
											referenceNumber]
											preferredStyle:UIAlertControllerStyleAlert];

							UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
							handler:^(UIAlertAction * action) {}];

							[alert addAction:defaultAction];
							[self presentViewController:alert animated:YES completion:nil];
						});

						checkHappened = YES;
					    // NSLog(@"Troy - Something went wrong with the activation of %@. This is not a user error, but rather a server error. When you see the developer, give them this: \nError message:%@\nReference number:%@", 
						// tweakName,
						// errorMessage, 
						// referenceNumber);
					} else {
					    // NSLog(@"Troy - Internet error, doing nothing.");
					}
				}
			} else {
			    // NSLog(@"Troy - Activation successfull!");
				checkHappened = YES;
			}

			checkInProgress = NO;
		}];
		[dataTask resume];
	}
}
%end

OBJC_EXTERN CFStringRef MGCopyAnswer(CFStringRef key) WEAK_IMPORT_ATTRIBUTE;
%ctor {
	//Get UDID
	CFStringRef (*$MGCopyAnswer)(CFStringRef);
	void *gestalt = dlopen("/usr/lib/libMobileGestalt.dylib", RTLD_GLOBAL | RTLD_LAZY);
	$MGCopyAnswer = (CFStringRef (*)(CFStringRef))dlsym(gestalt, "MGCopyAnswer");
	udid = (__bridge NSString*)$MGCopyAnswer(CFSTR("UniqueDeviceID"));

	//Get Model Number
	struct utsname systemInfo;
    uname(&systemInfo);
    model = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];

	%init();
}