#!/bin/bash

#Checking if there is an argument supplied
if [[ $# -ne 1 ]]; then
    echo "Please include a deb"
    echo "Usage: ./package.sh <path to deb>"
fi

#Checking if the first argument is a deb
if [[ ! -f "$1" ]]; then
    echo "Please include a deb"
    echo "Usage: ./package.sh <path to deb>"
fi

echo "Please enter your DRM license: "
read LICENSE

#If an earlier extracted package exists, delete the directory and all its files,
#then create it again and go into it
if [[ -d "extracted" ]]; then
    rm -r -f "extracted" > /dev/null
fi

mkdir "extracted" > /dev/null
cd "extracted"

#Extract the control and data files
ar -x "$1" > /dev/null
tar -xvf "control.tar.gz" > /dev/null
tar --lzma -xvf "data.tar.lzma" > /dev/null

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
    VALUE=${line#*}
    if [[ "$KEY" == "Package" ]]; then
        PACKAGE_ID=$(echo "$VALUE" | sed 's/ *$//g')
    elif [[ "$KEY" == "Name" ]]; then
        NAME=$(echo "$VALUE" | sed 's/ *$//g')
    fi
done <<< "$CONTROL"


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

        sed "s/\/\/DRM_TWEAK_REMOVE_FILES/\/\/DRM_TWEAK_REMOVE_FILES\n[foldersToDelete addObject:@\"${line:1}\"];/g" "tweak.xm"
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

        sed "s/\/\/DRM_TWEAK_REMOVE_FILES/\/\/DRM_TWEAK_REMOVE_FILES\n[foldersToDelete addObject:@\"${line:1}\"];/g" "tweak.xm"
    done <<< "$THEMES"
fi

#Copy add closer to postinst and postrm
echo "rm -r /Library/Application\ Support/Troy" >> "layout/DEBIAN/postinst"
echo "exit 0" >> "layout/DEBIAN/postinst"
echo "exit 0" >> "layout/DEBIAN/postrm"

#Copy control file
cp "../extracted/$CONTROL_DIRECTORY" "layout/DEBIAN/" > /dev/null

#Replace values in tweak.xm
sed "s/DRM_TWEAL_BUNDLE_ID/$PACKAGE_ID/g" "tweak.xm"
sed "s/DRM_TWEAK_NAME/$NAME/g" "tweak.xm"
sed "s/DRM_LICENSE/$LICENSE/g" "tweak.xm"