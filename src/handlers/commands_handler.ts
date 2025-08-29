const registryBlock: { commands: command[]; buttons: button[] } = {
  commands: [],
  buttons: [],
};
type command = {
  name: string;
  callback: Function;
};
type button = {
  id: string;
  callback: Function;
};
const registerCommand = (name: string, callback: Function) => {
  registryBlock.commands.push({
    name: name,
    callback: callback,
  });
};
const registerButton = (id: string, callback: Function) => {
  registryBlock.buttons.push({
    id,
    callback,
  });
};
export const registry = { registerCommand, registryBlock, registerButton };
export type { command, button };
