import type { Components, Theme } from '@mui/material/styles';
import { getMuiAppBarOverrides } from './MuiAppBar';
import { getMuiAvatarOverrides } from './MuiAvatar';
import { getMuiButtonOverrides } from './MuiButton';
import { getMuiButtonBaseOverrides } from './MuiButtonBase';
import { getMuiCardOverrides } from './MuiCard';
import { getMuiCardContentOverrides } from './MuiCardContent';
import { getMuiCardMediaOverrides } from './MuiCardMedia';
import { getMuiChipOverrides } from './MuiChip';
import { getMuiContainerOverrides } from './MuiContainer';
import { getMuiDividerOverrides } from './MuiDivider';
import { getMuiFabOverrides } from './MuiFab';
import { getMuiIconButtonOverrides } from './MuiIconButton';
import { getMuiListItemIconOverrides } from './MuiListItemIcon';
import { getMuiPaperOverrides } from './MuiPaper';
import { getMuiSvgIconOverrides } from './MuiSvgIcon';
import { getMuiTextFieldOverrides } from './MuiTextField';
import { getMuiToolbarOverrides } from './MuiToolbar';
import { getMuiTypographyOverrides } from './MuiTypography';

export function getComponents(theme: Theme): Components<Theme> {
  return {
    MuiAppBar: getMuiAppBarOverrides(theme),
    MuiAvatar: getMuiAvatarOverrides(theme),
    MuiButton: getMuiButtonOverrides(theme),
    MuiButtonBase: getMuiButtonBaseOverrides(theme),
    MuiCard: getMuiCardOverrides(),
    MuiCardContent: getMuiCardContentOverrides(),
    MuiCardMedia: getMuiCardMediaOverrides(theme),
    MuiChip: getMuiChipOverrides(theme),
    MuiContainer: getMuiContainerOverrides(theme),
    MuiDivider: getMuiDividerOverrides(theme),
    MuiFab: getMuiFabOverrides(theme),
    MuiIconButton: getMuiIconButtonOverrides(),
    MuiListItemIcon: getMuiListItemIconOverrides(theme),
    MuiPaper: getMuiPaperOverrides(theme),
    MuiSvgIcon: getMuiSvgIconOverrides(),
    MuiTextField: getMuiTextFieldOverrides(theme),
    MuiToolbar: getMuiToolbarOverrides(theme),
    MuiTypography: getMuiTypographyOverrides(theme),
  };
}
