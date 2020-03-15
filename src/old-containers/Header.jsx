import React from 'react'
import './Header.css'

class Header extends React.Component {
	render() {
		return <div className="header-container">
			<span>{this.props.title}</span>
			<span
			style={{
				marginRight: 10,
			}}
			>{this.props.children}</span>
		</div>
	}
}

export default Header
