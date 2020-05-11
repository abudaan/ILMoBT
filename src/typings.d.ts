// declare var require: {
//   <T>(path: string): T;
//   (paths: string[], callback: (...modules: any[]) => void): void;
//   ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
// };

// declare module "*.module.css";
// declare let require: any;

declare module "*.css" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module "*.scss" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}
