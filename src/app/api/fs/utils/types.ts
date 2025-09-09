import type {
  ImportDefinition,
  MethodCall,
  MethodDefinition,
} from '@/app/api/fs/utils/parser/types';

export interface IFile {
  readonly className: string;
  readonly imports: ImportDefinition[];
  readonly methods: MethodDefinition[];
  readonly calls: MethodCall[];
  readonly package: string;
  readonly path: string; // Relative path from project root
}

export interface IDirectory {
  [k: string]: IDirectory | IFile;
}
