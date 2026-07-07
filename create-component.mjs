/* eslint-disable no-undef */
import fs from 'fs';

const firstLetterToLoweCase = str => str.charAt(0).toLowerCase() + str.slice(1);

const componentPath = process.argv[2];
const componentName = componentPath.split('/').pop();
const lowerCaseComponentName = firstLetterToLoweCase(componentName);

fs.mkdir(componentPath, err => {
  if (err) throw err;

  const paths = [
    `${componentPath}/${componentName}.tsx`,
    `${componentPath}/Styles.module.scss`,
    `${componentPath}/index.ts`,
  ];

  fs.writeFile(
    paths[0],
    `import { JSX, memo } from 'react';
import cn from 'classnames';
import styles from './Styles.module.scss';

interface ${componentName}Props {}

function ${componentName}Component(): JSX.Element {
  return <div className={styles.${lowerCaseComponentName}}>${componentName}</div>;
}

export const ${componentName} = memo(${componentName}Component);
`,
    function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('tsx успешно создан');
    }
  );

  fs.writeFile(
    paths[1],
    `.${lowerCaseComponentName} {
  
}
`,
    function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('styles успешно создан');
    }
  );

  fs.writeFile(
    paths[2],
    `export { ${componentName} } from './${componentName}';
`,
    function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('index успешно создан');
    }
  );

  console.log(`Компонент ${componentPath} успешно создан!`);
});
