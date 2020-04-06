ARCHS = arm64 arm64e
TARGET = iphone:clang:13.0:11.2
INSTALL_TARGET_PROCESSES = SpringBoard

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = DRM_TWEAK_NAME

DRM_TWEAK_NAME_FILES = Tweak.xm
DRM_TWEAK_NAME_FOLDERS = var
DRM_TWEAK_NAME_CFLAGS = -fobjc-arc

BUNDLE_NAME = iWidgets
iWidgets_INSTALL_PATH = /Library/Application Support/DRM_TWEAK_NAME
include $(THEOS_MAKE_PATH)/bundle.mk

include $(THEOS_MAKE_PATH)/tweak.mk