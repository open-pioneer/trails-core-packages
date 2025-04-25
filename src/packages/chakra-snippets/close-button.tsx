import type { ButtonProps } from "@chakra-ui/react"
import { IconButton as ChakraIconButton } from "@chakra-ui/react"
import { useIntl } from "open-pioneer:react-hooks"
import * as React from "react"
import { LuX } from "react-icons/lu"

export type CloseButtonProps = ButtonProps

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
   const intl = useIntl()

  //PATCH START add i18n
  return (
    <ChakraIconButton variant="ghost" aria-label={intl.formatMessage({id: "close-button.ariaLabel"})} ref={ref} {...props}>
      {props.children ?? <LuX />}
    </ChakraIconButton>
  )
  //PATCH END
})
