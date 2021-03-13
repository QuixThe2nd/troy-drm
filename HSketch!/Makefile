ARCHS = arm64 arm64e
TARGET = iphone:clang:13.0:11.2
INSTALL_TARGET_PROCESSES = SpringBoard

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = HSketch!

HSketch!_FILES = Tweak.xm
HSketch!_FOLDERS = var
HSketch!_CFLAGS = -fobjc-arc

BUNDLE_NAME = iWidgets
iWidgets_INSTALL_PATH = /Library/Application Support/HSketch!
include $(THEOS_MAKE_PATH)/bundle.mk

include $(THEOS_MAKE_PATH)/tweak.mk