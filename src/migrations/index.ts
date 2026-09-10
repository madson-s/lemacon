import * as migration_20260810_191323_inicial from './20260810_191323_inicial';
import * as migration_20260811_162645_galeria_detalhes_home from './20260811_162645_galeria_detalhes_home';
import * as migration_20260812_024221_marcas from './20260812_024221_marcas';
import * as migration_20260812_031415_projetos from './20260812_031415_projetos';
import * as migration_20260812_032218_solucoes from './20260812_032218_solucoes';
import * as migration_20260828_171345_sobre_localizacao from './20260828_171345_sobre_localizacao';
import * as migration_20260904_041116_banners_home from './20260904_041116_banners_home';
import * as migration_20260910_135841_banners_hero from './20260910_135841_banners_hero';

export const migrations = [
  {
    up: migration_20260810_191323_inicial.up,
    down: migration_20260810_191323_inicial.down,
    name: '20260810_191323_inicial',
  },
  {
    up: migration_20260811_162645_galeria_detalhes_home.up,
    down: migration_20260811_162645_galeria_detalhes_home.down,
    name: '20260811_162645_galeria_detalhes_home',
  },
  {
    up: migration_20260812_024221_marcas.up,
    down: migration_20260812_024221_marcas.down,
    name: '20260812_024221_marcas',
  },
  {
    up: migration_20260812_031415_projetos.up,
    down: migration_20260812_031415_projetos.down,
    name: '20260812_031415_projetos',
  },
  {
    up: migration_20260812_032218_solucoes.up,
    down: migration_20260812_032218_solucoes.down,
    name: '20260812_032218_solucoes',
  },
  {
    up: migration_20260828_171345_sobre_localizacao.up,
    down: migration_20260828_171345_sobre_localizacao.down,
    name: '20260828_171345_sobre_localizacao',
  },
  {
    up: migration_20260904_041116_banners_home.up,
    down: migration_20260904_041116_banners_home.down,
    name: '20260904_041116_banners_home',
  },
  {
    up: migration_20260910_135841_banners_hero.up,
    down: migration_20260910_135841_banners_hero.down,
    name: '20260910_135841_banners_hero'
  },
];
