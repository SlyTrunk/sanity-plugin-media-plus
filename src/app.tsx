import {
  Box,
  Flex,
  Portal,
  PortalProvider,
  studioTheme,
  ThemeProvider,
  ToastProvider
} from '@sanity/ui'
import {AssetSourceComponentProps} from '@sanity/types'
import React, {forwardRef, MouseEvent, Ref} from 'react'
import {ThemeProvider as LegacyThemeProvider} from 'theme-ui'
import Browser from './components/Browser'
import ReduxProvider from './components/ReduxProvider'
import {Z_INDEX_APP, Z_INDEX_TOAST_PROVIDER} from './constants'
import {AssetBrowserDispatchProvider} from './contexts/AssetSourceDispatchContext'
import useKeyPress from './hooks/useKeyPress'
import GlobalStyle from './styled/GlobalStyles'
import theme from './styled/theme'

type Props = AssetSourceComponentProps

const AssetBrowser = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const {onClose, onSelect} = props

  // Close on escape key press
  useKeyPress('escape', onClose)

  // Stop propagation and prevent document mouse events from firing.
  // This is a bit of a hack to make this work with `editModal = 'popover'` and prevent Sanity's <Popover /> component from
  // prematurely closing, as it attaches events on `document` to detect outside clicks.
  const handleStopPropagation = (e: MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation()
    e.stopPropagation()
  }

  return (
    <ReduxProvider {...props}>
      <ThemeProvider scheme="dark" theme={studioTheme}>
        <LegacyThemeProvider theme={theme}>
          <PortalProvider element={document.body}>
            <ToastProvider zOffset={Z_INDEX_TOAST_PROVIDER}>
              {/* @ts-expect-error */}
              <AssetBrowserDispatchProvider onSelect={onSelect}>
                <GlobalStyle />

                {onClose ? (
                  <Portal>
                    <Box
                      onDragEnter={handleStopPropagation}
                      onDragLeave={handleStopPropagation}
                      onDragOver={handleStopPropagation}
                      onDrop={handleStopPropagation}
                      onMouseUp={handleStopPropagation}
                      ref={ref}
                      style={{
                        bottom: 0,
                        height: 'auto',
                        left: 0,
                        position: 'fixed',
                        top: 0,
                        width: '100%',
                        zIndex: Z_INDEX_APP
                      }}
                    >
                      <Browser onClose={onClose} />
                    </Box>
                  </Portal>
                ) : (
                  <Flex direction="column" ref={ref}>
                    <Browser />
                  </Flex>
                )}
              </AssetBrowserDispatchProvider>
            </ToastProvider>
          </PortalProvider>
        </LegacyThemeProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
})

export default AssetBrowser
