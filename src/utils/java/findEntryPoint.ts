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

    // This will only return the first found entry point, there might be more
    if (mainMethod) return file;
  }

  return null;
}
