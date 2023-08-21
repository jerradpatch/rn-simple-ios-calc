import {PaperProvider} from "react-native-paper";

import {Main} from "./src/pages/Main";

export default function App() {
  return (
    <PaperProvider>
      <Main />
    </PaperProvider>
  )
}
