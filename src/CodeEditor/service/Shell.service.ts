import { Injectable } from '@nestjs/common';
import * as child_process from 'child_process';

@Injectable()
export class ShellService {

  async excecuteCommand(command: string): Promise<string> {

    const output = new Promise<string>((resolve, reject) => {
      child_process.exec(command, async (err, stdout) => {
        if (err) {
          reject(err);
        }
        resolve(stdout);
      });
    });

    return output;
  }

}
