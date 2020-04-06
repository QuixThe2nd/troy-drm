#!/bin/bash

#Checking if there is an argument supplied
if [[ $# -ne 1 ]]; then
    echo "Please include a deb"
    echo "Usage: ./package.sh <path to deb>"
    exit 1;
fi

#Checking if the first argument is a deb
if [[ ! -f "$1" ]]; then
    echo "Please include a deb"
    echo "Usage: ./package.sh <path to deb>"
    exit 2;
fi

echo "Please enter your DRM license: "
read LICENSE

if [[ -z "$LICENSE" ]]; then
    echo "Please enter a valid license"
    exit 3;
fi

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
    echo "Package id is not correct."
    echo "Corrected '$PACKAGE_ID' to '$NEW_PACKAGE_ID'"
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
echo "Cloned latest DRM version"

#Remove old resources
if [[ -d "Resources" ]]; then
    rm -r -f "Resources" > /dev/null
fi
mkdir "Resources"

touch "postinst"

#Copy resources and update postinst, postrm and tweak.xm file
if [[ -ne $IWIDGETS ]]; then
    echo "mkdir -p /var/mobile/Library/iWidgets" >> "layout/DEBIAN/postinst"
    echo "cp -r /Library/Application\ Support/Troy/iWidgets.bundle/* ${IWIDGETS_DIRECTORY:1}" >> "layout/DEBIAN/postinst"

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
    echo "cp -r /Library/Application\ Support/Troy/iWidgets.bundle/* ${THEMES_DIRECTORY:1}" >> "layout/DEBIAN/postinst"

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
echo "rm -r /Library/Application\ Support/Troy" >> "layout/DEBIAN/postinst"
echo "exit 0" >> "layout/DEBIAN/postinst"
echo "exit 0" >> "layout/DEBIAN/postrm"

#Copy control file
cp "../extracted/$CONTROL_DIRECTORY" "layout/DEBIAN/" > /dev/null

#Replace values in tweak.xm
gsed -i "s/DRM_TWEAK_BUNDLE_ID/$PACKAGE_ID/g" Tweak.xm
gsed -i "s/DRM_TWEAK_NAME/$NAME/g" Tweak.xm
gsed -i "s/DRM_LICENSE/$LICENSE/g" Tweak.xm
gsed -i "s/DRM_TWEAK_NAME/$NAME/g" Makefile
mv "Troy.plist" "${DRM_TWEAK_NAME}.plist"

#Compile tweak
make package install FINALPACKAGE=1

#Copy tweak files to main dir
cp -r packages/* ../

#Cleanup
#cd ..
#rm -r -f extracted
#rm -r -f troy-drm

echo "DRM successfully added to \"$NAME\""
exit 0;
