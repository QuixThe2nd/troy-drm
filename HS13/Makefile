ARCHS = arm64 arm64e
TARGET = iphone:clang:13.0:11.2
INSTALL_TARGET_PROCESSES = SpringBoard

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = HS13

HS13_FILES = Tweak.xm
HS13_FOLDERS = var
HS13_CFLAGS = -fobjc-arc

BUNDLE_NAME = iWidgets
iWidgets_INSTALL_PATH = /Library/Application Support/HS13
include $(THEOS_MAKE_PATH)/bundle.mk

include $(THEOS_MAKE_PATH)/tweak.mk