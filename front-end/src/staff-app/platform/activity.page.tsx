import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Person } from "shared/models/person"
import BasicTable from "./table"

export const ActivityPage: React.FC = () => {
  const [getActivities, getRollData, loadGetRollState] = useApi<{ rollStudents: Person[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <S.Container>
      <S.Heading>
        Activity Page
      </S.Heading>
      <BasicTable data={getRollData && getRollData.activity} />
    </S.Container>
  )

}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  Heading: styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  font-size: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid
`,
}
