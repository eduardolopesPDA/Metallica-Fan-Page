---
name: entrega-e-publicacao
description: Fecha um projeto de site com commits aprovados um a um, verificação da hospedagem antes de publicar, README que explica o projeto e entrega ao cliente quando for trabalho freelance. Use ao terminar etapas de um site e sempre antes de qualquer commit, push ou deploy.
---

# Entrega e publicação

Commit, push e deploy são ações que outras pessoas veem e que nem sempre dá para desfazer. Esta skill garante que nada saia sem aprovação e que nada seja publicado duas vezes.

## 1. Commits só com aprovação

- **Proponha antes de fazer:** para cada commit, mostre a mensagem e a lista de arquivos e espere um "sim" para aquele commit.
- **Aprovação não se estende:** "pode seguir" ou "continua" aprova continuar o trabalho, não commitar. Aprovar um commit não aprova o push, e aprovar o push não aprova o deploy.
- **Commits por assunto:** dados e correções, funcionalidade, documentação, configuração. Um commit gigante com tudo dificulta revisar e desfazer.
- **Mensagens** no padrão do repositório (ex.: `feat(escopo): descrição`, no idioma do projeto).
- **Nunca** inclua arquivos com segredos (`.env`, tokens, credenciais). Confira o `.gitignore` antes do primeiro commit.
- Se estiver no branch principal e o fluxo do projeto usar branches, crie uma antes.

## 2. Antes de publicar

1. **O projeto já existe na hospedagem?** Liste os projetos da conta (ex.: `vercel project ls`, `netlify sites:list`). Uma pasta sem arquivo de vínculo local **não** significa que o projeto não existe.
2. **Está ligado ao repositório?** Se sim, o push já publica: não rode deploy manual. Confira o último deploy depois do push.
3. **Se for criar um projeto novo**, confirme o nome com a pessoa antes.
4. **Depois de publicar**, abra as páginas principais no endereço de produção e confira se respondem.
5. **Errou?** (ex.: criou um projeto duplicado) Conte na hora, explique como aconteceu, corrija o vínculo e pergunte antes de apagar qualquer coisa. Apagar é irreversível.

Ao vincular uma pasta à hospedagem, a ferramenta costuma criar arquivos locais (pasta de vínculo, `.env.local` com token). Eles devem estar no `.gitignore`: explique isso à pessoa e proponha o commit do `.gitignore`.

## 3. README

O README explica **o que é o projeto e por quê**:
- o que o site conta e para quem;
- a ideia central (os capítulos e seus conceitos, a história que conecta);
- o que é comum entre as páginas;
- os limites (direitos de imagem, como os fatos foram tratados, aviso de não oficial quando for o caso).

**Sem** instruções de instalação, de como rodar ou de deploy, a menos que a pessoa peça.

## 4. Entrega ao cliente (freelance)

| Item | Conteúdo |
|---|---|
| Endereço | produção e, se houver, homologação |
| Acesso | repositório, hospedagem, domínio, CMS: quem tem acesso e como transferir |
| Conteúdo | onde ficam os textos e como atualizar (arquivos de dados ou CMS) |
| Fontes e aprovações | documento de conteúdo e registro das aprovações |
| Direitos | origem de cada imagem e fonte usada |
| Limites conhecidos | navegadores testados, o que fica fora do escopo |
| Próximos passos | sugestões, sem compromisso |

Entregue num documento compartilhável, não só numa mensagem.

## Antes de encerrar

- [ ] Cada commit aprovado individualmente.
- [ ] Nenhum segredo versionado; `.gitignore` cobre os arquivos locais.
- [ ] Hospedagem conferida antes de publicar; nenhum projeto duplicado.
- [ ] Produção respondendo nas páginas principais.
- [ ] README explica o projeto e o porquê.
- [ ] Freelance: material de entrega enviado.
