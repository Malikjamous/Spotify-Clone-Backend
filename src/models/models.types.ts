import * as sequelize from 'sequelize';
import { IArtistModel } from './artist';
import { IAlbumModel } from './album';
import { ISongModel } from './song';
import { IUserModel } from './user';
import { IFavoriteSongModel } from './favoriteSong';
/* Begin: __bundle__ */
type IBaseAttribs<T> = { [P in keyof T]?: T[P] | T[P][] | any };

// tslint:disable-next-line:class-name
interface __IAnyAttrib {
  [key: string]: any;
}

export type IAttribs<T> = __IAnyAttrib & IBaseAttribs<T>;

interface IFinder<T> {
  where?: IAttribs<T>;
  include?: any;
  limit?: any;
  offset?: any;
  order?: any;
  attributes?: any;
  exclude?: any;
  group?: any;
  subQuery?: boolean;
  col?: any;
  distinct?: boolean;
  transaction?: any;
  duplicating?: boolean;
  having?: any;
  truncate?: boolean;
  paranoid?: boolean;
  raw?: boolean;
  force?: boolean;
  logging?: IFinderLoggingFunction;
}
type IFinderLoggingFunction = (query: string) => void;

interface IFindOrCreator<T> extends IFinder<T> {
  defaults?: any;
}

interface IGetOptions {
  plain: boolean;
}

interface ITransaction {
  transaction: sequelize.Transaction;
}

export interface IBaseModel<T> {
  dataValues?: any;
  get(options: IGetOptions, transaction?: ITransaction): T;
  update(attributes: IAttribs<T>, transaction?: ITransaction): Promise<T>;
  destroy(transaction?: ITransaction): Promise<void>;
  reload(transaction?: ITransaction): Promise<void>;
}

export interface IModel<T> {
  dataValues: any;
  _options: any;
  get(options: IGetOptions, transaction?: ITransaction): T;
  create(attribs: IAttribs<T>, transaction?: ITransaction): Promise<T>;
  findByPk(id: string, transaction?: ITransaction): Promise<T>;
  findAll(query: IFinder<T>): Promise<T[]>;
  findAndCountAll(query: IFinder<T>): Promise<ICountResult<T>>;
  findOne(query: IFinder<T>): Promise<T>;
  findOrCreate(options: IFindOrCreator<T>, transaction?: ITransaction): Promise<[T, boolean]>;
  count(query: IFinder<T>, transaction?: ITransaction): Promise<number>;
  update(attributes: IAttribs<T>, query?: IFinder<T>): Promise<T>;
  destroy(query?: IFinder<T>, transaction?: ITransaction): Promise<void>;
  upset(values: IAttribs<T>, transaction?: ITransaction): Promise<boolean>;
}

export interface ICountResult<T> {
  rows: T[];
  count: number;
}

/* End: __bundle__   */

export interface IModelCollection {
  user: IUserModel;
  artist: IArtistModel;
  album: IAlbumModel;
  song: ISongModel;
  favoriteSong: IFavoriteSongModel;
  sequelize: sequelize.Sequelize;
  Sequelize: sequelize.SequelizeStatic;
  transaction: () => Promise<sequelize.Transaction>;
}
