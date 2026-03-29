'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { useRegions } from '@/contexts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { TeLlevoClass } from '@/theme/teLlevoClasses';
import { RegionsAvatarStrip } from '@/components/ui/RegionsAvatarStrip';
import { CategoryBentoGrid } from '@/components/sections/CategoryBentoGrid';
import { FeaturedPromoCard } from '@/components/sections/FeaturedPromoCard';

const SEARCH_DEBOUNCE_MS = 320;

export function HomePageClient() {
  /** Si el usuario elige región en la franja; si no, se usa la primera ordenada. */
  const [pickedRegionId, setPickedRegionId] = useState<string | undefined>(undefined);
  const [regionSearch, setRegionSearch] = useState('');
  const debouncedSearch = useDebouncedValue(regionSearch, SEARCH_DEBOUNCE_MS);
  const backendQ = debouncedSearch.trim();

  const { setListParams, items: regions, isLoading, isFetching, error } = useRegions();

  useEffect(() => {
    setListParams(backendQ ? { q: backendQ } : undefined);
    return () => setListParams(undefined);
  }, [backendQ, setListParams]);

  const sortedRegions = useMemo(
    () => (regions ? [...regions].sort((a, b) => a.name.localeCompare(b.name, 'es')) : []),
    [regions]
  );

  /** Región activa en strip + categorías: con búsqueda en servidor, respeta la elegida si viene en la página actual; si no, la primera. */
  const displaySelectedId = useMemo(() => {
    const defaultId = pickedRegionId ?? sortedRegions[0]?.id ?? '';
    if (!backendQ) return defaultId;
    if (defaultId && sortedRegions.some((r) => r.id === defaultId)) return defaultId;
    return sortedRegions[0]?.id ?? '';
  }, [pickedRegionId, sortedRegions, backendQ]);

  const selectedRegion = sortedRegions.find((r) => r.id === displaySelectedId);
  const categories =
    selectedRegion?.categories?.map((rc) => rc.category).sort((a, b) => a.name.localeCompare(b.name, 'es')) ??
    [];

  if (error) {
    return (
      <Container maxWidth="sm" className={TeLlevoClass.catalogPageContainerCompact}>
        <Typography color="error">No se pudieron cargar las regiones.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={TeLlevoClass.catalogPageContainer}>
      <Box className={TeLlevoClass.heroBlock}>
        <Typography variant="body2" color="text.secondary" className={TeLlevoClass.heroKicker}>
          ¡Hola de nuevo!
        </Typography>
        <Typography variant="h2" component="h1" className={TeLlevoClass.heroTitle}>
          ¿A dónde{' '}
          <Box component="span" className={TeLlevoClass.heroAccent}>
            te llevamos
          </Box>{' '}
          hoy?
        </Typography>
        <TextField
          fullWidth
          className={TeLlevoClass.searchField}
          placeholder="Busca tu ciudad o municipio…"
          aria-label="Buscar ciudad o municipio"
          value={regionSearch}
          onChange={(e) => setRegionSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box className={TeLlevoClass.sectionHeaderRow}>
        <Typography variant="h5" component="h2" fontWeight={800}>
          Explora regiones
        </Typography>
        <Button
          variant="catalogLink"
          component={Link}
          href={displaySelectedId ? `/regiones/${displaySelectedId}` : '#'}
          size="small"
        >
          Ver todas
        </Button>
      </Box>
      {backendQ && !isFetching && !sortedRegions.length ? (
        <Typography color="text.secondary" className={TeLlevoClass.pageMessage}>
          No hay regiones que coincidan con «{backendQ}».
        </Typography>
      ) : (
        <RegionsAvatarStrip
          items={sortedRegions.map((r) => ({ id: r.id, name: r.name, image: r.image }))}
          selectedId={displaySelectedId}
          ariaLabel="Elegir región"
          isLoading={isLoading || isFetching}
          onSelect={setPickedRegionId}
        />
      )}

      {selectedRegion ? (
        <>
          <Box className={TeLlevoClass.sectionBlock}>
            <Typography variant="overline" color="text.secondary" className={TeLlevoClass.sectionEyebrow}>
              Descubre
            </Typography>
            <Typography variant="h4" component="h2" className={TeLlevoClass.sectionHeading}>
              Categorías en {selectedRegion.name}
            </Typography>
          </Box>
          <CategoryBentoGrid
            regionId={selectedRegion.id}
            regionName={selectedRegion.name}
            categories={categories}
          />
          <Box className={TeLlevoClass.sectionBlock}>
            <FeaturedPromoCard />
          </Box>
        </>
      ) : !isLoading && sortedRegions.length === 0 ? (
        <Typography color="text.secondary" className={TeLlevoClass.pageMessage}>
          Aún no hay regiones.
        </Typography>
      ) : null}
    </Container>
  );
}
