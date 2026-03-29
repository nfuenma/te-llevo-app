import { alpha, type Components, type Theme } from '@mui/material/styles';

export function getMuiTypographyOverrides(theme: Theme): NonNullable<Components<Theme>['MuiTypography']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-brandTitleLink': {
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: theme.palette.primary.dark,
          textDecoration: 'none',
          fontFamily: theme.typography.h6.fontFamily,
        },
        '&.TeLlevo-drawerHeading': {
          paddingInline: theme.spacing(2),
          paddingBottom: theme.spacing(1),
          fontWeight: 800,
        },
        '&.TeLlevo-heroKicker': {
          fontWeight: 600,
          marginBottom: theme.spacing(0.5),
        },
        '&.TeLlevo-heroTitle': {
          marginBottom: theme.spacing(2),
        },
        '&.TeLlevo-heroAccent': {
          color: theme.palette.primary.dark,
          fontStyle: 'italic',
        },
        '&.TeLlevo-sectionEyebrow': {
          display: 'block',
        },
        '&.TeLlevo-sectionHeading': {
          fontWeight: 800,
        },
        '&.TeLlevo-pageMessage': {
          paddingBlock: theme.spacing(2),
        },
        '&.TeLlevo-regionAvatarCaption': {
          display: 'block',
          marginTop: theme.spacing(1),
          textAlign: 'center',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          maxWidth: 88,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontWeight: 600,
          color: theme.palette.text.secondary,
          '&[data-selected="true"]': {
            fontWeight: 800,
            color: theme.palette.text.primary,
          },
        },
        '&.TeLlevo-bentoTileTitle': {
          lineHeight: 1.2,
          fontWeight: 800,
        },
        '&.TeLlevo-bentoTileSubtitle': {
          marginTop: theme.spacing(0.5),
          display: 'block',
        },
        '&.TeLlevo-bottomNavLabel': {
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontSize: '0.65rem',
          lineHeight: 1.2,
        },
        '&.TeLlevo-promoTitle': {
          color: theme.palette.common.white,
          fontWeight: 800,
          lineHeight: 1.15,
          textShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.45)}`,
        },
        '&.TeLlevo-promoSubtitle': {
          color: alpha(theme.palette.common.white, 0.92),
          marginTop: theme.spacing(1),
          maxWidth: 320,
          textShadow: `0 1px 8px ${alpha(theme.palette.common.black, 0.5)}`,
        },
      },
    },
  };
}
