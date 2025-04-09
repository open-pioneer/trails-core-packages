import type { ButtonProps, InputProps } from "@chakra-ui/react"
import {
  Button,
  Clipboard as ChakraClipboard,
  IconButton,
  Input,
} from "@chakra-ui/react"
import { useIntl } from "open-pioneer:react-hooks"
import * as React from "react"
import { LuCheck, LuClipboard, LuLink } from "react-icons/lu"

const ClipboardIcon = React.forwardRef<
  HTMLDivElement,
  ChakraClipboard.IndicatorProps
>(function ClipboardIcon(props, ref) {
  return (
    <ChakraClipboard.Indicator copied={<LuCheck />} {...props} ref={ref}>
      <LuClipboard />
    </ChakraClipboard.Indicator>
  )
})

const ClipboardCopyText = React.forwardRef<
  HTMLDivElement,
  ChakraClipboard.IndicatorProps
>(function ClipboardCopyText(props, ref) {
    const intl = useIntl();

  //PATCH START add i18n
  return (
    <ChakraClipboard.Indicator copied={intl.formatMessage({id: "clipboard.copied"})} {...props} ref={ref}>
      {intl.formatMessage({id: "clipboard.copy"})}
    </ChakraClipboard.Indicator>
  )
  //PATCH END
})

export const ClipboardLabel = React.forwardRef<
  HTMLLabelElement,
  ChakraClipboard.LabelProps
>(function ClipboardLabel(props, ref) {
  return (
    <ChakraClipboard.Label
      textStyle="sm"
      fontWeight="medium"
      display="inline-block"
      mb="1"
      {...props}
      ref={ref}
    />
  )
})

export const ClipboardButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function ClipboardButton(props, ref) {
    return (
      <ChakraClipboard.Trigger asChild>
        <Button ref={ref} size="sm" variant="surface" {...props}>
          <ClipboardIcon />
          <ClipboardCopyText />
        </Button>
      </ChakraClipboard.Trigger>
    )
  },
)

export const ClipboardLink = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function ClipboardLink(props, ref) {
    return (
      <ChakraClipboard.Trigger asChild>
        <Button
          unstyled
          variant="plain"
          size="xs"
          display="inline-flex"
          alignItems="center"
          gap="2"
          ref={ref}
          {...props}
        >
          <LuLink />
          <ClipboardCopyText />
        </Button>
      </ChakraClipboard.Trigger>
    )
  },
)

export const ClipboardIconButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function ClipboardIconButton(props, ref) {
  return (
    <ChakraClipboard.Trigger asChild>
      <IconButton ref={ref} size="xs" variant="subtle" {...props}>
        <ClipboardIcon />
        <ClipboardCopyText srOnly />
      </IconButton>
    </ChakraClipboard.Trigger>
  )
})

export const ClipboardInput = React.forwardRef<HTMLInputElement, InputProps>(
  function ClipboardInputElement(props, ref) {
    return (
      <ChakraClipboard.Input asChild>
        <Input ref={ref} {...props} />
      </ChakraClipboard.Input>
    )
  },
)

export const ClipboardRoot = ChakraClipboard.Root
