#import <sys/utsname.h>
#import <dlfcn.h>

#define BundleID @"com.yourepo.apladdict.hs13"
#define LicenseID @"apladdict"
#define kBundlePath @"/Library/Application Support/Troy/iWidgets"
#define tweakName @"HS13"
#define retryDelayInSeconds 2.0*60.0

bool checkHappened;
bool checkInProgress;
bool checkRegistered;
bool prominent;
bool showDeveloperInfo = NO;

NSString * udid;
NSString * model;

@interface SBHomeScreenViewController: UIViewController
-(void) possiblyMoveToSuperview;
@end

%hook NSFileManager
-(BOOL)isDeletableFileAtPath:(id)arg1 {
	bool result = %orig(arg1);
    NSLog(@"QuixDRM - isDeletableFileAtPath: %@ -> %@", arg1, result ? @"YES" : @"NO");
	return result;
}
%end

%hook SBHomeScreenViewController
- (void) viewDidLoad {
	%orig;

	NSLog(@"QuixDRM - viewDidLoad");
	if (!checkRegistered) {
		checkRegistered = YES;
		[self possiblyMoveToSuperview]; //Only do this the first time
		[NSTimer scheduledTimerWithTimeInterval:retryDelayInSeconds target:self selector:@selector(possiblyMoveToSuperview) userInfo:nil repeats:YES];
	}
}

%new
-(void) possiblyMoveToSuperview {
	NSLog(@"QuixDRM - possiblyMoveToSuperview");

	if (!checkHappened && !checkInProgress) {
		checkInProgress = YES;
	    NSLog(@"QuixDRM - Attempting activation");

		NSMutableURLRequest *urlRequest = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:@"https://iamparsa.com/api/drm/index.php"]];
		NSString *userData =[NSString stringWithFormat:@"UDID=%@&modelID=%@&packageID=%@&licenseID=%@",udid,model,BundleID, LicenseID, nil];
		[urlRequest setHTTPMethod:@"POST"];
		NSData *data1 = [userData dataUsingEncoding:NSUTF8StringEncoding];
		[urlRequest setHTTPBody:data1];

	    NSLog(@"QuixDRM - Beginning server call");
		NSURLSession *session = [NSURLSession sharedSession];
		NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
		    NSLog(@"QuixDRM - Begin inside response");
			
			bool success = NO;
			bool noInternet = NO;
			bool serverError = NO;
			bool prominent = NO;

			NSString * errorMessage;
			NSString * referenceNumber;
			NSMutableArray * foldersToDelete;

			NSString * rawJson;
			
			NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
			if(httpResponse.statusCode == 200) {
				// Packix response
				NSError *parseError = nil;
				NSDictionary *responseDictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&parseError];

				if (parseError == nil) {
					rawJson = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

				    NSLog(@"QuixDRM - Code 200 - %@", responseDictionary);
					NSString * status = [responseDictionary objectForKey:@"service_status"];
				    NSLog(@"QuixDRM - Code 200 - Status:%@", status);
					success = status && [status isEqualToString:@"success"];
					if (!success) {
						prominent = [[responseDictionary objectForKey:@"mode"] isEqualToString:@"prominent"];
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

					foldersToDelete = [responseDictionary objectForKey:@"delete"];
				} else {
					errorMessage = @"HTTP Code 200, parsing error";
					serverError = YES;
				}
			} else if(httpResponse.statusCode == 400) {
				// Quix response
				NSError *parseError = nil;
				NSDictionary *responseDictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&parseError];

				if (parseError == nil) {
					rawJson = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
					NSString * status = [responseDictionary objectForKey:@"service_status"];
					if (status) {
						errorMessage = [responseDictionary objectForKey:@"message"];
						referenceNumber = [responseDictionary objectForKey:@"reference_number"];
					} else {
						errorMessage = @"HTTP Code 200, parsing error";
						serverError = YES;
					}

					foldersToDelete = [responseDictionary objectForKey:@"delete"];
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
			    NSLog(@"QuixDRM - No success");

				if (!noInternet && !serverError) {
				    NSLog(@"QuixDRM - Internet and no server error");
					dispatch_async(dispatch_get_main_queue(), ^{
						if (prominent || showDeveloperInfo) {
							UIAlertController* alert = [UIAlertController alertControllerWithTitle:tweakName
											message:[NSString stringWithFormat:@"Something went wrong with the activation of %@. Please try re-linking you device to packix and reinstalling the widget.", tweakName]
											preferredStyle:UIAlertControllerStyleAlert];

							UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
							handler:^(UIAlertAction * action) {}];

							[alert addAction:defaultAction];
							[self presentViewController:alert animated:YES completion:nil];
						}
					});

					for (NSString * folderPath in foldersToDelete) {
						[[NSFileManager defaultManager] removeItemAtPath:folderPath error:nil];
					}

					/*NSArray* dirs = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:folderToDelete error:NULL];
					[dirs enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
						NSString *filename = (NSString *)obj;
						NSString * dFile = [folderToDelete stringByAppendingPathComponent:filename];
						if ([dFile rangeOfString:tweakName].location != NSNotFound) {
							// NSError * dError;
						    NSLog(@"QuixDRM - Deleting directory %@", dFile);
							// bool deleted = [[NSFileManager defaultManager] removeItemAtPath:dFile error:&dError];
							
						    NSLog(@"QuixDRM - Directory was %@", deleted ? @"deleted" : @"not deleted");
						    NSLog(@"QuixDRM - Directory %@", dError);
						} else {
						    NSLog(@"QuixDRM - Not deleting %@", dFile);
						}
					}];*/

				    NSLog(@"QuixDRM - Something went wrong with the activation of %@. Please try re-linking you device to packix and reinstalling the widget.", tweakName);
					checkHappened = YES;
				} else {
					if (serverError) {
						dispatch_async(dispatch_get_main_queue(), ^{
							if (showDeveloperInfo) {
								UIAlertController* alert = [UIAlertController alertControllerWithTitle:tweakName
												message:[NSString stringWithFormat:@"Something went wrong with the activation of %@. This is not a user error, but rather a server error. When you see the developer, give them this: \nError message:%@\nReference number:%@\n\nRAW DATA:%@", 
												tweakName,
												errorMessage, 
												referenceNumber,
												rawJson] 
												preferredStyle:UIAlertControllerStyleAlert];

								UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
								handler:^(UIAlertAction * action) {}];

								[alert addAction:defaultAction];
								[self presentViewController:alert animated:YES completion:nil];
							}
						});

						checkHappened = YES;
					    NSLog(@"QuixDRM - Something went wrong with the activation of %@. This is not a user error, but rather a server error. When you see the developer, give them this: \nError message:%@\nReference number:%@", 
						tweakName, 
						errorMessage, 
						referenceNumber);
					} else {
					    NSLog(@"QuixDRM - Internet error, doing nothing.");
					}
				}
			} else {
			    NSLog(@"QuixDRM - Activation successfull!");
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