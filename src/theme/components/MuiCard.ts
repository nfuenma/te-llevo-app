import { alpha, type Components, type Theme } from '@mui/material/styles';

function elevationShadows(t: Theme) {
  const idle =
    t.palette.mode === 'light'
      ? `0 8px 24px ${alpha('#392e00', 0.08)}`
      : `0 8px 24px ${alpha(t.palette.common.black, 0.35)}`;
  const hover =
    t.palette.mode === 'light'
      ? `0 12px 28px ${alpha('#392e00', 0.12)}`
      : `0 12px 28px ${alpha(t.palette.common.black, 0.45)}`;
  return { idle, hover };
}

function promoCardStyles(t: Theme) {
  return {
    '&.TeLlevo-promoCard': {
      position: 'relative',
      display: 'block',
      textDecoration: 'none',
      color: 'inherit',
      borderRadius: t.spacing(4),
      minHeight: 220,
      [t.breakpoints.up('sm')]: {
        minHeight: 260,
      },
      boxShadow:
        t.palette.mode === 'light'
          ? `0 12px 32px ${alpha(t.palette.common.black, 0.12)}`
          : `0 12px 32px ${alpha(t.palette.common.black, 0.4)}`,
      '@media (hover: hover)': {
        '&:hover': {
          boxShadow:
            t.palette.mode === 'light'
              ? `0 16px 36px ${alpha(t.palette.common.black, 0.16)}`
              : `0 16px 36px ${alpha(t.palette.common.black, 0.5)}`,
        },
      },
      '&:focus-visible': {
        outline: `2px solid ${t.palette.primary.main}`,
        outlineOffset: 2,
        boxShadow:
          t.palette.mode === 'light'
            ? `0 16px 36px ${alpha(t.palette.common.black, 0.16)}`
            : `0 16px 36px ${alpha(t.palette.common.black, 0.5)}`,
      },
    },
  } as const;
}

/** Estilo global “Te Llevo”: radios, sombra cálida, borde suave; `outlined` sin sombra base. */
export function getMuiCardOverrides(): NonNullable<Components<Theme>['MuiCard']> {
  return {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme: t, ownerState }) => {
        const r = t.shape.borderRadius;
        const transition = t.transitions.create(['box-shadow', 'transform'], {
          duration: t.transitions.duration.shorter,
        });
        const common = {
          borderRadius: r,
          backgroundImage: 'none',
        } as const;
        const promo = promoCardStyles(t);

        if (ownerState.variant === 'outlined') {
          return {
            ...common,
            boxShadow: 'none',
            borderColor: alpha(t.palette.text.primary, 0.14),
            transition,
            ...promo,
          };
        }

        const { idle, hover } = elevationShadows(t);
        return {
          ...common,
          overflow: 'hidden',
          border: `1px solid ${alpha(t.palette.divider, 0.1)}`,
          boxShadow: idle,
          transition,
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: hover,
            },
          },
          '&:focus-visible': {
            transform: 'translateY(-2px)',
            boxShadow: hover,
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '@media (hover: hover)': {
              '&:hover': {
                transform: 'none',
                boxShadow: idle,
              },
            },
            '&:focus-visible': {
              transform: 'none',
              boxShadow: idle,
            },
          },
          ...promo,
        };
      },
    },
  };
}
