ARCHS = arm64 arm64e
TARGET = iphone:clang:13.0:11.2
INSTALL_TARGET_PROCESSES = SpringBoard

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = Troy

Troy_FILES = Tweak.xm
Troy_FOLDERS = var
Troy_CFLAGS = -fobjc-arc

BUNDLE_NAME = iWidgets
iWidgets_INSTALL_PATH = /Library/Application Support/Troy
include $(THEOS_MAKE_PATH)/bundle.mk

include $(THEOS_MAKE_PATH)/tweak.mk