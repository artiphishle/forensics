import assert from 'node:assert';
import test, { describe } from 'node:test';
import { markCyclicPackages } from '@/utils/cytoscape/rules/markCyclicPackages';
import type { ElementsDefinition } from 'cytoscape';
import type { IDirectory, IFile } from '@/types/types';

describe('[markCyclicPackages]', () => {
  test('Marks package cycle: A-B-A using nested directory structure', () => {
    const directory: IDirectory = {
      src: {
        main: {
          java: {
            com: {
              example: {
                myapp: {
                  'App.java': {
                    className: 'App',
                    package: 'com.example.myapp',
                    imports: [
                      {
                        name: 'com.example.myapp.a.A',
                        pkg: 'com.example.myapp.a',
                        isIntrinsic: true,
                      },
                    ],
                    methods: [],
                    calls: [],
                    path: 'src/main/java/com/example/myapp/App.java',
                  } as IFile,
                  a: {
                    'A.java': {
                      className: 'A',
                      package: 'com.example.myapp.a',
                      imports: [
                        {
                          name: 'com.example.myapp.b.B',
                          pkg: 'com.example.myapp.b',
                          isIntrinsic: true,
                        },
                        {
                          name: 'com.example.myapp.c.C',
                          pkg: 'com.example.myapp.c',
                          isIntrinsic: true,
                        },
                        {
                          name: 'com.example.myapp.d.D',
                          pkg: 'com.example.myapp.d',
                          isIntrinsic: true,
                        },
                      ],
                      methods: [],
                      calls: [],
                      path: 'src/main/java/com/example/myapp/a/A.java',
                    } as IFile,
                  },
                  b: {
                    'B.java': {
                      className: 'B',
                      package: 'com.example.myapp.b',
                      imports: [
                        {
                          name: 'com.example.myapp.a.A',
                          pkg: 'com.example.myapp.a',
                          isIntrinsic: true,
                        },
                      ],
                      methods: [],
                      calls: [],
                      path: 'src/main/java/com/example/myapp/b/B.java',
                    } as IFile,
                  },
                  c: {
                    'C.java': {
                      className: 'C',
                      package: 'com.example.myapp.c',
                      imports: [],
                      methods: [],
                      calls: [],
                      path: 'src/main/java/com/example/myapp/c/C.java',
                    } as IFile,
                  },
                  d: {
                    'D.java': {
                      className: 'D',
                      package: 'com.example.myapp.d',
                      imports: [],
                      methods: [],
                      calls: [],
                      path: 'src/main/java/com/example/myapp/d/D.java',
                    } as IFile,
                  },
                },
              },
            },
          },
        },
        test: {
          java: {
            com: {
              example: {
                myapp: {
                  'AppTest.java': {
                    className: 'AppTest',
                    package: 'com.example.myapp',
                    imports: [
                      { name: 'junit.framework.Test', pkg: 'junit.framework' },
                      { name: 'junit.framework.TestCase', pkg: 'junit.framework' },
                      { name: 'junit.framework.TestSuite', pkg: 'junit.framework' },
                    ],
                    methods: [],
                    calls: [],
                    path: 'src/test/java/com/example/myapp/AppTest.java',
                  } as IFile,
                },
              },
            },
          },
        },
      },
    };
    const elements: ElementsDefinition = {
      nodes: [
        {
          data: {
            id: 'com.example.myapp',
            label: 'myapp',
            isParent: true,
            packageCycle: false,
            isIntrinsic: true,
          },
          classes: '',
        },
        {
          data: {
            id: 'com.example.myapp.a',
            label: 'a',
            packageCycle: false,
            isIntrinsic: true,
          },
          classes: '',
        },
        {
          data: {
            id: 'com.example.myapp.b',
            label: 'b',
            packageCycle: false,
            isIntrinsic: true,
          },
          classes: '',
        },
        {
          data: {
            id: 'com.example.myapp.c',
            label: 'c',
            packageCycle: false,
            isIntrinsic: true,
          },
          classes: '',
        },
        {
          data: {
            id: 'com.example.myapp.d',
            label: 'd',
            packageCycle: false,
            isIntrinsic: true,
          },
          classes: '',
        },
        {
          data: {
            id: 'junit.framework',
            label: 'framework',
            packageCycle: false,
            isIntrinsic: true,
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
            id: 'edge1',
          },
        },
        {
          data: {
            source: 'com.example.myapp.a',
            target: 'com.example.myapp.b',
            weight: 1,
            id: 'edge2',
          },
        },
        {
          data: {
            source: 'com.example.myapp.a',
            target: 'com.example.myapp.c',
            weight: 1,
            id: 'edge3',
          },
        },
        {
          data: {
            source: 'com.example.myapp.a',
            target: 'com.example.myapp.d',
            weight: 1,
            id: 'edge4',
          },
        },
        {
          data: {
            source: 'com.example.myapp.b',
            target: 'com.example.myapp.a',
            weight: 1,
            id: 'edge5',
          },
        },
        {
          data: {
            source: 'com.example.myapp',
            target: 'junit.framework',
            weight: 1,
            id: 'edge6',
          },
        },
      ],
    };
    const result = markCyclicPackages(elements, directory);
    const cyclic = result.nodes.filter(n => n.classes.includes('packageCycle'));
    assert.deepStrictEqual(
      cyclic.map(n => n.data.id).sort(),
      ['com.example.myapp.a', 'com.example.myapp.b'].sort()
    );
  });
});
