import { generateSequenceFromProject } from '@/utils/mermaid/generateSequenceFromProject';
import MermaidView from '@/components/views/SequenceView';
import Header from '@/components/Header';
import Main from '@/components/Main';

export default async function SequenceDiagramPage() {
  const diagram = await generateSequenceFromProject();

  return (
    <>
      <Header title="Sequence Diagram" />
      <Main>
        <MermaidView code={diagram} />
      </Main>
    </>
  );
}
