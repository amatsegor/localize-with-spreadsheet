import {LSLine} from "../modeles/LSLine";
import {Transformer} from "../transformer/Transformer";
import {Options} from "../modeles/Options";
/**
 * Created by amatsegor on 5/4/17.
 */

export interface AbstractWriter {
    write(filePath: string, lines: Array<LSLine>, transformer: Transformer, options: Options);
}