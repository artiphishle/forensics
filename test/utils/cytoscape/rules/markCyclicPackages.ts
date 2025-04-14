import assert from 'node:assert';
import test, { describe } from 'node:test';
import { markCyclicPackages } from '@/utils/cytoscape/rules/markCyclicPackages';
import type { ElementsDefinition } from 'cytoscape';
import type { IFile } from '@/types/types';

describe('[markCyclicPackages]', () => {
  // Find & mark package cycle: A-B-A
  test('Marks package cycle: A-B-A ', () => {
    const files: IFile[] = [
      {
        className: 'App',
        package: 'com.example.myapp',
        imports: ['com.example.myapp.a.A'],
        methods: [], // Mock
        calls: [], // Mock
        path: 'src/main/java/com/example/myapp/App.java',
      },
      {
        className: 'A',
        package: 'com.example.myapp.a',
        imports: ['com.example.myapp.b.B', 'com.example.myapp.c.C', 'com.example.myapp.d.D'],
        methods: [],
        calls: [], // Mock
        path: 'src/main/java/com/example/myapp/a/A.java',
      },
      {
        className: 'B',
        package: 'com.example.myapp.b',
        imports: ['com.example.myapp.a.A'],
        methods: [],
        calls: [], // Mock
        path: 'src/main/java/com/example/myapp/b/B.java',
      },
      {
        className: 'C',
        package: 'com.example.myapp.c',
        imports: [],
        methods: [],
        calls: [], // Mock
        path: 'src/main/java/com/example/myapp/c/C.java',
      },
      {
        className: 'D',
        package: 'com.example.myapp.d',
        imports: [],
        methods: [],
        calls: [], // Mock
        path: 'src/main/java/com/example/myapp/d/D.java',
      },
      {
        className: 'AppTest',
        package: 'com.example.myapp',
        imports: ['junit.framework.Test', 'junit.framework.TestCase', 'junit.framework.TestSuite'],
        methods: [], // Mock
        calls: [],
        path: 'src/test/java/com/example/myapp/AppTest.java',
      },
    ];
    const elements: ElementsDefinition = {
      nodes: [
        {
          data: {
            id: 'com.example.myapp',
            label: 'myapp',
            isParent: true,
            packageCycle: false,
          },
          classes: '',
        },
        {
          data: {
            id: 'com.example.myapp.a',
            label: 'a',
            packageCycle: true,
          },
          classes: 'packageCycle',
        },
        {
          data: {
            id: 'com.example.myapp.b',
            label: 'b',
            packageCycle: true,
          },
          classes: 'packageCycle',
        },
        {
          data: {
            id: 'com.example.myapp.c',
            label: 'c',
            packageCycle: false,
          },
          classes: '',
        },
        {
          data: {
            id: 'com.example.myapp.d',
            label: 'd',
            packageCycle: false,
          },
          classes: '',
        },
        {
          data: {
            id: 'junit.framework',
            label: 'framework',
            packageCycle: false,
          },
          classes: '',
        },
      ],
      edges: [
        {
          data: {
            source: 'com.example.myapp',
            target: 'com.example.myapp.a',
            weight: 1,
            id: '549de6bc-7fe5-4331-b3f1-6370ce8e4709',
          },
        },
        {
          data: {
            source: 'com.example.myapp.a',
            target: 'com.example.myapp.b',
            weight: 1,
            id: '862d3125-32af-462d-8d4f-bff99c2494cd',
          },
        },
        {
          data: {
            source: 'com.example.myapp.a',
            target: 'com.example.myapp.c',
            weight: 1,
            id: '399ca9a9-820c-4da4-b95c-4d2ad1f8f93a',
          },
        },
        {
          data: {
            source: 'com.example.myapp.a',
            target: 'com.example.myapp.d',
            weight: 1,
            id: '0eab813f-0796-4c92-b92e-74857089040a',
          },
        },
        {
          data: {
            source: 'com.example.myapp.b',
            target: 'com.example.myapp.a',
            weight: 1,
            id: '0581b6fc-eed8-4212-9ca6-e07c3f3ac42d',
          },
        },
        {
          data: {
            source: 'com.example.myapp',
            target: 'junit.framework',
            weight: 1,
            id: '9057bf48-5ca6-48cd-b6ac-e79fce19dab2',
          },
        },
      ],
    };

    const result = markCyclicPackages(elements, files);
    const cyclic = result.nodes.filter(n => n.classes.includes('packageCycle'));
    assert.strictEqual(cyclic.length, 2);
  });
});
