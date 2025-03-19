import fs from 'fs'
import path from 'path'
import MarkDownItContainer from 'markdown-it-container'
import MarkdownIt from 'markdown-it'

const localMd = MarkdownIt()

// 以 VitePress 为例，创建 :::demo 语法
export default (md: MarkdownIt) => {
    console.log(md.use);
    
    md.use(MarkDownItContainer, 'demo', {
        validate(params) {
            return params.trim().match(/^demo\s*(.*)$/)
        },
        // render(tokens, idx) {

        //     console.log(tokens, idx);
            
        // const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
        // if (tokens[idx].nesting === 1) {
        //     const description = m && m.length > 1 ? m[1] : ''
        //     const content = tokens[idx + 2].content
        //     console.log(content,'content');
            
        //     return `<DemoBlock source="${encodeURIComponent(content)}">`
        // }
        //     return '</DemoBlock>'
        // }
        render(tokens, idx) {
            const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
            if (tokens[idx].nesting === 1 /* means the tag is opening */) {
              const description = m && m.length > 1 ? m[1] : ''
              const sourceFileToken = tokens[idx + 2]
              let source = ''
              const sourceFile = sourceFileToken.children?.[0].content ?? ''
                
              console.log(sourceFile,'sourceFile');
              console.log(__dirname);
              
              
              if (sourceFileToken.type === 'inline') {
                source = fs.readFileSync(
                  path.resolve(__dirname, '../../examples',`${sourceFile}`),
                  'utf-8'
                )
              }

              if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
      
              return `<DemoBlock :demos="demos" source="${encodeURIComponent(source)}"
               path="${sourceFile}" 
               raw-source="${encodeURIComponent(
                source
              )}" description="${encodeURIComponent(localMd.render(description))}">`
            } else {
              return '</DemoBlock>'
            }
          },
    })
}