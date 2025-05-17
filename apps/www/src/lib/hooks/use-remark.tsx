/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
import { useCallback, useState } from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import rehypeReact, { type Options as RehypeReactOptions } from 'rehype-react'
import remarkParse, { type Options as RemarkParseOptions } from 'remark-parse'
import remarkRehype, { type Options as RemarkRehypeOptions } from 'remark-rehype'
import { unified, type Plugin, type PluggableList, type Processor } from 'unified'
import type { Root } from 'mdast'

export interface UseRemarkOptions {
    remarkParseOptions?: RemarkParseOptions
    remarkPlugins?: PluggableList
    remarkRehypeOptions?: RemarkRehypeOptions
    rehypePlugins?: PluggableList
    rehypeReactOptions?: Pick<RehypeReactOptions, 'components'>
    onError?: (err: Error) => void
}

export default function useRemark({
    remarkParseOptions,
    remarkPlugins = [],
    remarkRehypeOptions,
    rehypePlugins = [],
    rehypeReactOptions,
    onError = () => { },
}: UseRemarkOptions = {}): [React.ReactElement | null, (source: string) => void] {
    const [content, setContent] = useState<React.ReactElement | null>(null)

    const setMarkdown = useCallback((source: string) => {
        const processor = unified()
            .use(remarkParse, remarkParseOptions)
            .use(remarkPlugins as Plugin[])
            .use(remarkRehype as Plugin, remarkRehypeOptions)
            .use(rehypePlugins as Plugin[])
            .use(rehypeReact, {
                ...rehypeReactOptions,
                Fragment: jsxRuntime.Fragment,
                jsx: jsxRuntime.jsx,
                jsxs: jsxRuntime.jsxs,
            } satisfies RehypeReactOptions) as unknown as Processor<Root, Root, React.ReactElement>

        processor
            .process(source)
            .then(vfile => setContent(vfile.result as React.ReactElement))
            .catch(onError)
    }, [])

    return [content, setMarkdown]
}