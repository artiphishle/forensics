import { parseFile } from './parseFile';

type TypeScriptParsedFile = Awaited<ReturnType<typeof parseFile>>;

export function findEntryPoint(files: TypeScriptParsedFile[]): TypeScriptParsedFile | null {
  for (const file of files) {
    console.log('=====file======');
    console.log(file);

    return file;
  }

  return null;
}
