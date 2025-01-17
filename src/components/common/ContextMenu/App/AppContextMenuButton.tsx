import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import React, { PropsWithChildren, useCallback, useMemo } from "react";
import { MenuConfig } from "react-native-ios-context-menu/lib/typescript/types/MenuConfig";
import { StyleProp, ViewStyle } from "react-native";
import { MenuElementConfig } from "react-native-ios-context-menu/src/types/MenuConfig";
import { ContextMenuOption } from "../../../../types/ContextMenuOptions";

interface AppContextMenuButtonProps<S = string> extends PropsWithChildren {
  options: ContextMenuOption[];
  selection?: S;
  title?: string;
  isPrimaryAction?: boolean;
  style?: StyleProp<ViewStyle>;
  onPressMenuItem: OnPressMenuItemEvent;
}

export function AppContextMenuButton<S = string>(
  props: AppContextMenuButtonProps<S>
) {
  const {
    children,
    selection,
    title = "",
    options,
    isPrimaryAction = true,
    style,
    onPressMenuItem,
  } = props;

  const transformOption = useCallback(
    (option: ContextMenuOption): MenuElementConfig => {
      if (option.options) {
        return {
          type: "menu",
          menuOptions: option.inline ? ["displayInline"] : [],
          menuTitle: option.title,
          icon: {
            type: "IMAGE_SYSTEM",
            imageValue: {
              systemName: option.icon,
            },
          },
          menuItems: [...option.options.map(transformOption)],
        };
      }
      return {
        actionKey: option.key,
        actionTitle: option.title,
        actionSubtitle: option.subtitle,
        menuState: selection === option.key ? "on" : "off",
        menuAttributes: option.destructive ? ["destructive"] : [],
        icon: {
          type: "IMAGE_SYSTEM",
          imageValue: {
            systemName: option.icon,
          },
        },
      };
    },
    [selection]
  );

  const menuConfig = useMemo<MenuConfig>(
    () => ({
      menuTitle: title,
      menuItems: [...options.map(transformOption)],
    }),
    [options, title, transformOption]
  );

  return (
    <ContextMenuButton
      isMenuPrimaryAction={isPrimaryAction}
      menuConfig={menuConfig}
      style={style}
      onPressMenuItem={onPressMenuItem}
    >
      {children}
    </ContextMenuButton>
  );
}
