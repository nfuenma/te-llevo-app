import {alpha, type Components, type Theme} from '@mui/material/styles';

export function getMuiPaperOverrides(theme: Theme): NonNullable<Components<Theme>['MuiPaper']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-bentoTile': {
          position: 'relative',
          display: 'flex',
          borderRadius: theme.spacing(4),
          overflow: 'hidden',
          textDecoration: 'none',
          color: 'inherit',
          justifyContent: 'space-between',
          transition: theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.shorter,
          }),
          boxShadow:
            theme.palette.mode === 'light'
              ? `0 8px 24px ${alpha(theme.palette.common.black, 0.06)}`
              : `0 8px 24px ${alpha(theme.palette.common.black, 0.35)}`,
          '&:hover, &:focus-visible': {
            transform: 'translateY(-3px)',
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 12px 28px ${alpha(theme.palette.common.black, 0.1)}`
                : `0 12px 28px ${alpha(theme.palette.common.black, 0.45)}`,
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        },
        '&.TeLlevo-bottomNav': {
          display: 'block',
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme.zIndex.appBar,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingInline: theme.spacing(1),
          paddingTop: theme.spacing(1.25),
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: 'blur(16px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: `0 -8px 28px ${alpha('#392e00', 0.06)}`,
          [theme.breakpoints.up('md')]: {
            display: 'none',
          },
        },
      },
    },
  };
}
