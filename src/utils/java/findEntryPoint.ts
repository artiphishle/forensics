import { parseJavaFile } from '@/utils/java/parseJavaFile';

type JavaParsedFile = Awaited<ReturnType<typeof parseJavaFile>>;

export function findEntryPoint(files: JavaParsedFile[]): JavaParsedFile | null {
  for (const file of files) {
    const mainMethod = file.methods.find(
      m =>
        m.name === 'main' &&
        m.returnType === 'void' &&
        m.parameters.length === 1 &&
        m.parameters[0].includes('String[]') &&
        m.visibility === 'public'
    );

    if (mainMethod) return file;
  }

  return null;
}
