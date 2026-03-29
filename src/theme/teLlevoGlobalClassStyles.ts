import { alpha, type Theme } from '@mui/material/styles';
import { TeLlevoClass } from './teLlevoClasses';

/**
 * Estilos globales para utilidades `.TeLlevo-*` (MUI no expone `MuiBox` en `theme.components`).
 */
export function getTeLlevoGlobalClassStyles(theme: Theme) {
  return {
    [`.${TeLlevoClass.main}`]: {
      minHeight: '100dvh',
      paddingTop: '64px',
      paddingBottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
      [theme.breakpoints.up('sm')]: {
        paddingTop: '72px',
      },
      [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(3),
      },
    },
    [`.${TeLlevoClass.toolbarCluster}`]: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      zIndex: 1,
    },
    [`.${TeLlevoClass.drawerPaper}`]: {
      width: 280,
      paddingTop: theme.spacing(2),
    },
    [`.${TeLlevoClass.heroBlock}`]: {
      marginBottom: theme.spacing(3),
    },
    [`.${TeLlevoClass.sectionHeaderRow}`]: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1.5),
      gap: theme.spacing(2),
    },
    [`.${TeLlevoClass.sectionBlock}`]: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    },
    [`.${TeLlevoClass.loadingCenter}`]: {
      display: 'flex',
      justifyContent: 'center',
      paddingBlock: theme.spacing(4),
    },
    [`.${TeLlevoClass.loadingCenterTight}`]: {
      display: 'flex',
      justifyContent: 'center',
      paddingBlock: theme.spacing(3),
    },
    [`.${TeLlevoClass.loadingCenterSpacious}`]: {
      display: 'flex',
      justifyContent: 'center',
      paddingBlock: theme.spacing(6),
    },
    [`.${TeLlevoClass.catalogList}`]: {
      paddingBlock: theme.spacing(1),
    },
    [`.${TeLlevoClass.regionsStrip}`]: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: theme.spacing(2),
      width: '100%',
      overflowX: 'auto',
      paddingBottom: theme.spacing(0.5),
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
      scrollbarGutter: 'stable',
      '&::-webkit-scrollbar': { height: 6 },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: 3,
        backgroundColor: alpha(theme.palette.text.primary, 0.2),
      },
      [theme.breakpoints.up('sm')]: {
        scrollSnapType: 'none',
      },
    },
    [`.${TeLlevoClass.regionItemStack}`]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 88,
      flex: '0 0 auto',
      scrollSnapAlign: 'start',
    },
    [`.${TeLlevoClass.bentoGrid}`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
    [`.${TeLlevoClass.bentoRow}`]: {
      display: 'grid',
      gap: theme.spacing(2),
    },
    [`.${TeLlevoClass.bentoTileInner}`]: {
      display: 'flex',
      alignItems: 'flex-start',
      flex: 1,
      minWidth: 0,
    },
    [`.${TeLlevoClass.bentoTileInner}.${TeLlevoClass.bentoTileInnerRow}`]: {
      flexDirection: 'row',
      gap: theme.spacing(2),
    },
    [`.${TeLlevoClass.bentoTileInner}.${TeLlevoClass.bentoTileInnerCol}`]: {
      flexDirection: 'column',
      gap: theme.spacing(1.5),
    },
    [`.${TeLlevoClass.bentoIconWrap}`]: {
      width: 48,
      height: 48,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    [`.${TeLlevoClass.bentoTextBlock}`]: {
      minWidth: 0,
    },
    [`.${TeLlevoClass.bentoEducationCircle}`]: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow:
        theme.palette.mode === 'light'
          ? `0 4px 14px ${alpha(theme.palette.common.black, 0.08)}`
          : 'none',
    },
    [`.${TeLlevoClass.bentoDecoration}`]: {
      position: 'absolute',
      top: -24,
      right: -32,
      width: 120,
      height: 120,
      borderRadius: '50%',
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },
    [`.${TeLlevoClass.bottomNavInner}`]: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      maxWidth: 480,
      marginInline: 'auto',
    },
    [`.${TeLlevoClass.promoGradient}`]: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.15)} 0%, ${alpha(theme.palette.common.black, 0.65)} 100%)`,
    },
    [`.${TeLlevoClass.promoContent}`]: {
      position: 'absolute',
      inset: 0,
      padding: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    [`.${TeLlevoClass.catalogLayoutHeader}`]: {
      marginBottom: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
    },
    [`.${TeLlevoClass.chipRow}`]: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(0.5),
    },
  };
}
