import React, { useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'
import classnames from 'classnames'

export const Style = (props) => {
  const { competition } = props
  if (!competition) return null
  if (competition.id === 'WOFT' || competition.id === 'WWC') {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `a, .nav-menu a, .mobile-nav-toggle i { color: #ff4d94; } 
          a:hover, .nav-menu a:hover, .nav-menu li:hover > a { color: #4d94ff; }
          .nav-link.disabled { color: #ff80b3 }
          .mobile-nav { background: #ff4d94 }
          .mobile-nav-overly { background: rgba(255, 219, 233, 0.4) }`,
        }}
      />
    )
  }
  return null
}

export const NestedTabs = () => {
  const [activeTab, setActiveTab] = useState({ level1: '1', level2: '1' })

  const toggle = (tab) => {
    if (activeTab.level1 !== tab.level1 || activeTab.level2 !== tab.level2) setActiveTab(tab)
  }
  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab.level1 === '1' })}
            onClick={() => {
              toggle({ level1: '1', level2: '1' })
            }}
          >
            Tab1
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab.level1 === '2' })}
            onClick={() => {
              toggle({ level1: '2' })
            }}
          >
            Moar Tabs
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab.level1}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <h4>Tab 1 Contents</h4>
              <Nav>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab.level2 === '1' })}
                    onClick={() => {
                      toggle({ level1: '1', level2: '1' })
                    }}
                  >
                    Tab1-1
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab.level2 === '2' })}
                    onClick={() => {
                      toggle({ level1: '1', level2: '2' })
                    }}
                  >
                    Tab1-2
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab.level2}>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <h4>Tab 1-1 Contents</h4>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <h4>Tab 1-2 Contents</h4>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <h4>Tab 2 Contents</h4>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  )
}
