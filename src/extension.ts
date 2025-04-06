import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log('"ts-js-react-template" is now active!');

  const generateJsComponentTemplate = (componentName: string): string => {
    const template = [
      `import { memo } from 'react'`,
      `import { useTranslation } from 'react-i18next'`,
      ``,
      `// ----------------------------------------------------------------------`,
      ``,
      `import { useStyles } from './style'`,
      ``,
      `// ----------------------------------------------------------------------`,
      ``,
      `const ${componentName} = () => {`,
      `	 const classes = useStyles()`,
      `	 const { t } = useTranslation(['common'])`,
      ``,
      `	 return (`,
      `		 <div className={classes.root}>`,
      `		 </div>`,
      `	 )`,
      `}`,

      ``,
      `export default memo(${componentName})`,
    ].join("\n");

    return template;
  };
  const generateTsComponentTemplate = (componentName: string): string => {
    const template = [
      `import { memo } from 'react'`,
      `import { useTranslation } from 'react-i18next'`,
      ``,
      `import { useStyles } from './style'`,
      ``,
      `// ----------------------------------------------------------------------`,
      ``,
      `const ${componentName}: React.FC = () => {`,
      `	 const classes = useStyles()`,
      `	 const { t } = useTranslation(['common'])`,
      ``,
      `	 return (`,
      `		 <div className={classes.root}>`,
      `		 </div>`,
      `	 )`,
      `}`,
      ``,
      `export default memo(${componentName})`,
    ].join("\n");

    return template;
  };
  const generateJsStyleTemplate = (): string => {
    const template = [
      `import { makeStyles } from '@mui/styles'`,
      ``,
      `// ----------------------------------------------------------------------`,
      ``,
      `export const useStyles = makeStyles((theme) => ({`,
      `	 root: {`,
      `		 // Add your styles here`,
      `		 padding: theme.spacing(2),`,
      `		 backgroundColor: theme.palette.background.default,`,
      `	 }`,
      `}))`,
    ].join("\n");

    return template;
  };
  const generateTsStyleTemplate = (): string => {
    const template = [
      `import { makeStyles } from '@mui/styles'`,
      `import { Theme } from '@mui/material/styles'`,
      `// ----------------------------------------------------------------------`,
      ``,
      `export const useStyles = makeStyles((theme: Theme) => ({`,
      `	 root: {`,
      `		 // Add your styles here`,
      `		 padding: theme.spacing(2),`,
      `		 backgroundColor: theme.palette.background.default,`,
      `	 }`,
      `}))`,
    ].join("\n");

    return template;
  };

  const newReactComponentTemplate =
    (type: "tsx" | "jsx") => async (uri: any) => {
      const componentName = await vscode.window.showInputBox({
        prompt: "Enter the react component name",
      });

      if (!componentName) {
        vscode.window.showErrorMessage("Enter the react component name!");
        return;
      }

      const folderPath = uri.fsPath;
      const newComponentPath = path.join(folderPath, componentName);

      if (!fs.existsSync(newComponentPath)) {
        fs.mkdirSync(newComponentPath);

        const componentTemplate =
          type === "tsx"
            ? generateTsComponentTemplate(componentName)
            : generateJsComponentTemplate(componentName);
        const styleTemplate =
          type === "tsx"
            ? generateTsStyleTemplate()
            : generateJsStyleTemplate();

        fs.writeFileSync(
          path.join(newComponentPath, `index.${type}`),
          componentTemplate
        );
        fs.writeFileSync(
          path.join(newComponentPath, `styles.${type.slice(0, -1)}`),
          styleTemplate
        );

        vscode.window.showInformationMessage("React Component Created!");
      } else {
        vscode.window.showErrorMessage(`React Component already Exist`);
      }
    };

  const disposableNewReactComponentTemplateJs = vscode.commands.registerCommand(
    "ts-js-react-template.new-js-component-template",
    newReactComponentTemplate("jsx")
  );
  const disposableNewReactComponentTemplateTs = vscode.commands.registerCommand(
    "ts-js-react-template.new-ts-component-template",
    newReactComponentTemplate("tsx")
  );

  context.subscriptions.push(disposableNewReactComponentTemplateJs);
  context.subscriptions.push(disposableNewReactComponentTemplateTs);
}

export function deactivate() {}
