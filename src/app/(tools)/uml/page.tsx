import { generateSequenceFromProject } from '@/utils/mermaid/generateSequenceFromProject';
import UmlView from '@/components/UmlView';
import Header from '@/components/Header';
import Main from '@/components/Main';

export default async function SequenceDiagramPage() {
  const diagram = await generateSequenceFromProject();

  return (
    <>
      <Header title="Sequence Diagram" />
      <Main>
        <UmlView />
        {/* <UmlView code={diagram} />*/}
      </Main>
    </>
  );
}
