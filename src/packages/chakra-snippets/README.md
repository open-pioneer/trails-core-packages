# @open-pioneer/chakra-snippets

Contains packaged Chakra snippets for Open Pioneer Trails applications.
These are (mostly) default, unmodified snippets downloaded using the Chakra CLI.

When Chakra's documentation refers to a snippet such as this:

```tsx
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
```

Then you can _usually_ use it simply from this package instead without having to install the snippet yourself:

```tsx
import { PasswordInput, PasswordStrengthMeter } from "@open-pioneer/chakra-snippets/password-input";
```

If you notice a problem with one of the snippets, or if snippets are missing, feel free to open an issue or a pull request.

## Usage

### Available Snippets

- `alert.tsx`
- `avatar.tsx`
- `blockquote.tsx`
- `breadcrumb.tsx`
- `carousel.tsx`
- `checkbox-card.tsx`
- `checkbox.tsx`
- `clipboard.tsx`: Prefer to use this snippet instead of the default Chakra one. The default `Clipboard` is not translated.
- `close-button.tsx`: Prefer to use this snippet instead of the default Chakra one. The default `CloseButton` is not translated.
- `combobox.tsx`
- `data-list.tsx`
- `empty-state.tsx`
- `field.tsx`
- `input-group.tsx`
- `link-button.tsx`
- `native-select.tsx`
- `number-input.tsx`
- `password-input.tsx`
- `pin-input.tsx`
- `prose.tsx`
- `qr-code.tsx`
- `radio-card.tsx`
- `radio.tsx`
- `rating.tsx`
- `slider.tsx`
- `status.tsx`
- `stepper-input.tsx`
- `switch.tsx`
- `tag.tsx`
- `tags-input.tsx`
- `toggle-tip.tsx`
- `toggle.tsx`
- `tooltip.tsx`: Prefer to use this snippet for the shorter `openDelay`.

### Differences from Chakra's default snippets

- Aria labels and messages are translated (this currently only affects the `CloseButton` and the `Clipboard`).
- The `Tooltip` component has a shorter default `openDelay` (500 ms instead of 1000 ms).

## License

Apache-2.0 (see `LICENSE` file)
