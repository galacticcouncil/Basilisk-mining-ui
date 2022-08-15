import { FC } from "react"
import { ReactNode } from "react"
import { Header } from "./Header/Header"
import { StyledPage, PageInner, PageContent } from "./Page.styled"

type PageProps = {
  children: ReactNode
}

export const Page: FC<PageProps> = ({ children }) => (
  <StyledPage>
    <Header />
    <PageContent>
      <PageInner>{children}</PageInner>
    </PageContent>
  </StyledPage>
)
