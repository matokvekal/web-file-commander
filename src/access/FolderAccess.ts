declare const folderRefBrand: unique symbol;

export interface FolderRef {
  readonly [folderRefBrand]: true;
}

export interface Entry {
  name: string;
  kind: 'file' | 'folder';
}

export type ChooseResult =
  | { status: 'ok'; folder: FolderRef }
  | { status: 'denied' }
  | { status: 'cancelled' };

export type ListResult =
  | { status: 'ok'; entries: Entry[] }
  | { status: 'denied' };

export interface FolderAccess {
  isSupported(): boolean;
  chooseFolder(): Promise<ChooseResult>;
  listEntries(folder: FolderRef): Promise<ListResult>;
}
