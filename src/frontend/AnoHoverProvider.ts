/*
 * This file is released under the MIT license.
 * Copyright (c) 2016, 2020, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { TextDocument, Position, CancellationToken, Hover, ProviderResult, HoverProvider, MarkdownString } from "vscode";
import { getHover } from "../backend/hovering";

export class AnoHoverProvider implements HoverProvider {
    public provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
        const hover:string[] = getHover(position.line+1,position.character);
        return new Hover(hover.map(x=>new MarkdownString(x)));
    }
}
