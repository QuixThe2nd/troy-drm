var language = ""; // (french/Italian/portuguese/german) Leave blank for English
var defaultPage = "1"; // Changes default launch page (1=Weather/Date/Time) (2=Music Player) (3=Device Info) (4=Countdown)
var pageSwitch = true; // Enables/Disables tapping to switch page
var playingIcon = true; // Shows playing icon on main page when media is playing
var hideWeather = false; // Hides weather
var hideDate = false; // Hides date
var clock = false; // Enables 24hour clock
var seconds = false; // shows seconds
var dayMonth = false; // Places day of month before name of month
var feelsLike = false;
var musicApp = "com.apple.Music";
var musicIcon = "assets/music.jpg"; // Url/File path to app icon (do not type http:) (For themes use /Library/Themes/[theme name].theme/IconBundles/[bundleID]-large.png)
var showArt = false; // Hides/shows album art
var backgroundArt = true; // Makes the widget background the album art 
var invert = true; // Inverts text/icons when backgroundArt is a light color (BETA)
var borderWidth = "2"; // Width of the border around album art in px (leave blank for none) 
var borderColor = "white"; // Color of album art border when light mode enabled
var darkBorderColor = "white"; // Color of album art border when dark mode enabled
var stockIcons = true; // Uses stock iOS media controls
var infoAlign = "center"; // Text position for device info page (left/right/center)
var fontURL = "/System/Library/Fonts/Watch/SFCompactText.ttf"; // Url to custom font file
var countdown = true; // Hide/Show countdown page
var countMonth = "jun"; // Abreviated month you are counting down to
var countDay = "11"; // Day you are counting down to
var countYear = "2020"; // Year you are counting down to
var countHour = "0"; // Hour you are counting down to (24hour)(optional)
var countMinute = "0"; // Minute you are counting down to (required)
var eventName = "Last day of school"; // Replaces date on countdown leave black to show date
var scale = "1"; // Widget Scale size
var radius = "20px"; // Widget border radius
var refresh = "30"; // Refreshes widget and returns it to default page after this many seconds
var LightBackground = true; // Enables a light theme
var customColor = ""; // Custom background color when light mode enabled (leave blank for default)
var image = ""; // Url to custom background image
var opacity = "0.2"; // Opacity when light mode enabled
var PickColor = "black"; // Pick a custom color for when light mode enabled (Type a color name or a hex code)(leave blank for default)
var timeColor = ""; // Pick a custom color for time when light mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var dateColor = ""; // Pick a custom color for date when light mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var tempColor = ""; // Pick a custom color for temp when light mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var highLowColor = ""; // Pick a custom color for high/low temp when light mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var cityColor = ""; // Pick a custom color for city when light mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var dayHourColor = ""; // Pick a custom color for day/hour when light mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var todayRainColor = ""; // Pick a custom color for todays chance of rain when light mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var notesColor = "black"; // Pick a custom color for notes when dark mode enabled (Type a color name or a hex code)(leave blank for default)
var darkLightBackground = false; // Enables a light theme when dark mode enabled
var darkCustomColor = ""; // Custom background color when dark mode enabled (leave blank for default)
var darkImage = ""; // Url to custom background image when dark mode enabled
var darkOpacity = "0.2"; // Opacity when dark mode enabled
var darkPickColor = ""; // Pick a custom color for when dark mode enabled (Type a color name or a hex code)(leave blank for default)
var darkTimeColor = ""; // Pick a custom color for time when dark mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var darkDateColor = ""; // Pick a custom color for date when dark mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var darkTempColor = ""; // Pick a custom color for temp when dark mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var darkHighLowColor = ""; // Pick a custom color for high/low temp when dark mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var darkCityColor = ""; // Pick a custom color for city when dark mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var darkDayHourColor = ""; // Pick a custom color for day/hour when dark mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var darkTodayRainColor = ""; // Pick a custom color for todays chance of rain when dark mode enabled (Type a color name or a hex code)(leave blank for default)(overrides PickColor)
var darkNotesColor = "white"; // Pick a custom color for notes when dark mode enabled (Type a color name or a hex code)(leave blank for default)
var exportSettings = false; // Turn on to view and copy your settings.
var importSettings = "../HS13/red.js"; // Url to custom Config.js file (do not include this setting in custom Config.js settings file)