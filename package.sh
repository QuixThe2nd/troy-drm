#!/bin/bash

ENABLE_DEVELOPER="false"
ENABLE_DRY_RUN="false"
INSTALL_ON_SUCCESS="false"

for arg in "$@"; do
    if [[ "$arg" == "-d" || "$arg" == "--dry-run" ]]; then
        ENABLE_DRY_RUN="true"
    elif [[ "$arg" == "-i" || "$arg" == "--developer-info" ]]; then
        ENABLE_DEVELOPER="true"
    elif [[ "$arg" == "-o" || "$arg" == "--install-on-success" ]]; then
        INSTALL_ON_SUCCESS="true"
    fi
done

#Checking if there is an argument supplied
if [[ $# -lt 2 ]]; then
    echo "Error 1"
    echo "Please include a deb"
    echo "Usage: ./package.sh <path to deb> <license> <options>"
    echo "Options: --dry-run -d"-
    echo "Options: --developer-info -i"
    echo "Options: --install-on-success -o"
    exit 1;
fi

#Checking if the first argument is a deb
if [[ ! -f "$1" || -z "$2" ]]; then
    echo "Error 2"
    echo "Please include a deb"
    echo "Usage: ./package.sh <path to deb> <license> <options>"
    echo "Options: --dry-run -d"
    echo "Options: --developer-info -i"
    echo "Options: --install-on-success -o"
    exit 2;
fi

if [[ ! -d "received" ]]; then
    mkdir "received" > /dev/null
fi

UDID="${1%.*}"
UDID="${UDID##*\/}"
echo "Starting AutoDRM for $UDID" > "${UDID}.log"

#If an earlier extracted package exists, delete the directory and all its files,
#then create it again and go into it
if [[ -d "extracted" ]]; then
    rm -r -f "extracted" > /dev/null
fi

mkdir "extracted" > /dev/null
cd "extracted"

#Extract the control and data files
ar -x "$1" > /dev/null

if [[ -f "control.tar.gz" ]]; then
    tar -xvf "control.tar.gz" > /dev/null
fi
if [[ -f "data.tar.gz" ]]; then
    tar -xvf "data.tar.gz" > /dev/null
fi
if [[ -f "data.tar.lzma" ]]; then
    tar --lzma -xvf "data.tar.lzma" > /dev/null
fi
if [[ -f "control.tar.lzma" ]]; then
    tar --lzma -xvf "control.tar.lzma" > /dev/null
fi

#Read the control file
CONTROL=""
CONTROL_DIRECTORY=""
if [[ -d "control" ]]; then
    CONTROL=$(cat "control/control")
    CONTROL_DIRECTORY="control/control"
else
    CONTROL=$(cat "control")
    CONTROL_DIRECTORY="control"
fi

#Find the package id in the control file
PACKAGE_ID=""
NAME=""

while IFS= read -r line; do
    KEY=${line%%:*}
    VALUE=${line#*:}
    if [[ "$KEY" == "Package" ]]; then
        PACKAGE_ID=$(echo "$VALUE" | gsed -e 's/^[ ]*//')
        PACKAGE_ID=$(echo "$PACKAGE_ID" | gsed -e 's/[ ]*$//')
    elif [[ "$KEY" == "Name" ]]; then
        NAME=$(echo "$VALUE" | gsed -e 's/^[ ]*//')
        NAME=$(echo "$NAME" | gsed -e 's/[ ]*$//')
    fi
done <<< "$CONTROL"

#Possibly correct the package ID
NEW_PACKAGE_ID=$(echo "$PACKAGE_ID" | tr '[:upper:]' '[:lower:]')
NEW_PACKAGE_ID="${NEW_PACKAGE_ID//[^a-z-.+]/}"
if [[ "$PACKAGE_ID" != "$NEW_PACKAGE_ID" ]]; then
    echo "Package id is not correct." >> "../${UDID}.log"
    echo "Corrected '$PACKAGE_ID' to '$NEW_PACKAGE_ID'" >> "../${UDID}.log"
    gsed -i "s/$PACKAGE_ID/$NEW_PACKAGE_ID/g" "$CONTROL_DIRECTORY"
    PACKAGE_ID="$NEW_PACKAGE_ID"
fi

###Find directories to include in delete
IWIDGETS=""
THEMES=""

##Check for widgets
IWIDGETS_DIRECTORY=$(find . -type d | grep -Eo '^.+?\/iWidgets$')

#Find all widget directories
if [[ -ne "$IWIDGETS_DIRECTORY" ]]; then
    IWIDGETS=$(find . -type d | grep -Eo '^.+?\/iWidgets\/[^\/]+?$')
fi

##Check for themes
THEMES_DIRECTORY=$(find . -type d | grep -Eo '^.+?\/Themes$')

#Find all widget directories
if [[ -ne "$THEMES_DIRECTORY" ]]; then
    THEMES=$(find . -type d | grep -Eo '^.+?\/Themes\/[^\/]+?$')
fi


#If an earlier extracted DRM version exists, delete the directory and all its files,
#then create it again and go into it
cd ..

if [[ -d "troy-drm" ]]; then
    rm -r -f "troy-drm" > /dev/null
fi

#Clone template project and enter directory
git clone --quiet git@github.com:QuixThe2nd/troy-drm.git > /dev/null
cd troy-drm
echo "Cloned latest DRM version" >> "../${UDID}.log"

#Remove old resources
if [[ -d "Resources" ]]; then
    rm -r -f "Resources" > /dev/null
fi
mkdir "Resources"

touch "postinst"

#Copy resources and update postinst, postrm and tweak.xm file
if [[ -ne $IWIDGETS ]]; then
    echo "mkdir -p /var/mobile/Library/iWidgets" >> "layout/DEBIAN/postinst"
    echo "cp -r /Library/Application\ Support/$NAME/iWidgets.bundle/* ${IWIDGETS_DIRECTORY:1}" >> "layout/DEBIAN/postinst"

    while IFS= read -r line; do
        VALUE=${line:2}
        cp -r "../extracted/${line:2}" "Resources/" > /dev/null

        echo "if [[ -d \"${line:1}\" ]]; then" >> "layout/DEBIAN/postinst"
        echo "chmod -R 775 \"${line:1}\"" >> "layout/DEBIAN/postinst"
        echo "fi" >> "layout/DEBIAN/postinst"

        echo "if [[ -d \"${line:1}\" ]]; then" >> "layout/DEBIAN/postrm"
        echo "rm -r \"${line:1}\"" >> "layout/DEBIAN/postrm"
        echo "fi" >> "layout/DEBIAN/postrm"

        gsafe=$(echo ${line:1} | sed 's=\/=\\\/=g');
        gsed -i "s=\/\/DRM_TWEAK_REMOVE_FILES=\/\/DRM_TWEAK_REMOVE_FILES\\n[foldersToDelete addObject:@\"$gsafe\"];=g" Tweak.xm
    done <<< "$IWIDGETS"
fi

#Copy resources and update postinst, postrm and tweak.xm file
if [[ -ne $THEMES ]]; then
    echo "mkdir -p /Library/Themes" >> "layout/DEBIAN/postinst"
    echo "cp -r /Library/Application\ Support/$NAME/iWidgets.bundle/* ${THEMES_DIRECTORY:1}" >> "layout/DEBIAN/postinst"

    while IFS= read -r line; do
        VALUE=${line:2}
        cp -r "../extracted/${line:2}" "Resources/" > /dev/null

        echo "if [[ -d \"${line:1}\" ]]; then" >> "layout/DEBIAN/postinst"
        echo "chmod -R 775 \"${line:1}\"" >> "layout/DEBIAN/postinst"
        echo "fi" >> "layout/DEBIAN/postinst"

        echo "if [[ -d \"${line:1}\" ]]; then" >> "layout/DEBIAN/postrm"
        echo "rm -r \"${line:1}\"" >> "layout/DEBIAN/postrm"
        echo "fi" >> "layout/DEBIAN/postrm"

	gsafe=$(echo ${line:1} | sed 's=\/=\\\/=g');
        gsed -i "s=\/\/DRM_TWEAK_REMOVE_FILES=\/\/DRM_TWEAK_REMOVE_FILES\\n[foldersToDelete addObject:@\"$gsafe\"];=g" Tweak.xm
    done <<< "$THEMES"
fi

#Copy add closer to postinst and postrm
echo "rm -r /Library/Application\ Support/$NAME" >> "layout/DEBIAN/postinst"
echo "exit 0" >> "layout/DEBIAN/postinst"
echo "exit 0" >> "layout/DEBIAN/postrm"

#Copy control file
cp "../extracted/$CONTROL_DIRECTORY" "layout/DEBIAN/" > /dev/null

#Replace values in tweak.xm
gsed -i "s/DRM_TWEAK_BUNDLE_ID/$PACKAGE_ID/g" Tweak.xm
gsed -i "s/DRM_TWEAK_NAME/$NAME/g" Tweak.xm
gsed -i "s/DRM_LICENSE/$2/g" Tweak.xm
gsed -i "s/DRM_TWEAK_NAME/$NAME/g" Makefile
mv "Troy.plist" "${NAME}.plist"

if [[ "$ENABLE_DEVELOPER" == "true" ]]; then
    gsed -i "s/showDeveloperInfo = NO/showDeveloperInfo = YES/g" Tweak.xm
    echo "Enabling developer info" >> "../${UDID}.log"
fi

if [[ "$ENABLE_DRY_RUN" == "true" ]]; then
    gsed -i "s/dryRun = NO/dryRun = YES/g" Tweak.xm
    echo "Enabling dry run" >> "../${UDID}.log"
fi


#Compile tweak
if [[ "$INSTALL_ON_SUCCESS" == "true" ]]; then
    make package install FINALPACKAGE=1 > /dev/null 2> /dev/null
else
    make package FINALPACKAGE=1 > /dev/null 2> /dev/null
fi

#Copy tweak files to main dir
cp -r packages/*.deb "../$UDID.drm.deb"

#Cleanup
cd ..
rm -r -f extracted
rm -r -f troy-drm

echo "DRM successfully added to \"$NAME\"" >> "${UDID}.log"
echo "Done" >> "${UDID}.log"
exit 0;
