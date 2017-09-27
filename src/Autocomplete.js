import React, {Component} from 'react'
import './assets/Autocomplete.css'

class Autocomplete extends Component{
  

  constructor(){
	super();
	this.state = {
	  options:[],
	  selectedMembers:[]	
	}
	
	this.clearOptions = this.clearOptions.bind(this);
	this.selectOption = this.selectOption.bind(this);
	this.setFocus = this.setFocus.bind(this);
	this.getSuggestions = this.getSuggestions.bind(this);
	this.removeMember = this.removeMember.bind(this);
	this.listObj;
  }
  
  componentDidMount(){
	this.listObj = document.getElementById(this.props.id).querySelector('.autoSuggestions');
    this.setFocus; 
  }
  
  
  set value(val){
	this.refs.selectedInputs.value = val;  
  }
  
  get value(){
	return this.refs.selectedInputs.value;  
  }
  
  setFocus(){
    this.refs.selectedInputs.focus();	
  }
  
  clearOptions(){
	this.setState({options:[]});
	this.listObj.classList.remove('visible');
  }

  getSuggestions(){  
    if(this.value.length > 1){
	  this.setState({
		options:this.props.options.filter((opt) => opt.text.toUpperCase().indexOf(this.value.toUpperCase().trim()) > -1)
	  })
	  this.listObj.classList.add('visible');
	}
	else{
	  this.clearOptions()
	}
  }
  
  selectOption(input){
	  this.setState({
		  selectedMembers: [...this.state.selectedMembers, {text:input.innerText,id:input.getAttribute('data-id')}]
	  },this.updateHandler)
	  this.clearOptions();
	  this.value = '';
	  this.setFocus;
  }
  
  removeMember(event){
	const input = event.target;
	this.setState({
	  selectedMembers: this.state.selectedMembers.filter((obj,idx) => idx != input.getAttribute('data-id')) 
	},this.updateHandler)
  }
  
  updateHandler(){
	this.props.func({id:this.props.id,values:this.state.selectedMembers})  
  }
  
  render(){
	return(
	  <Container id={this.props.id} className="autocomplete-react-com" clickTracker={this.clearOptions}>
	    <div className="listHolder" ref="savedItems" onClick={this.setFocus}>
		  {
			this.state.selectedMembers.map((obj,idx) => (
			  <span className="selectedItem" key={idx} data-id={obj.id}>{obj.text}<span className="selectedItemRemove" title="Remove" data-id={idx} onClick={this.removeMember}>×</span></span> 
			))
		  }
		  <input type="text" className="entryText" placeholder={this.props.placeHolder} ref="selectedInputs" onKeyUp={this.getSuggestions}/>
		</div>
		<Suggest options={this.state.options} selectOption={this.selectOption}/>
	  </Container>
	)  
  }
}

class Suggest extends Component{
  constructor(){
    super()
	this.setRef = this.setRef.bind(this)
  }
  
  setRef(event){
	  this.props.selectOption(event.target)
  }
  
  render(){
	return(
	  <div className="autoSuggestions">
		 {this.props.options.map(
		   (opt, idx) => (
			 <div key={idx} data-id={opt.value} onClick={this.setRef}>{opt.text}</div> 
		 ))}
	  </div>
	)  	
  }
}

class Container extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);           
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /**
     * Set the wrapper ref
     */
    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.props.clickTracker()
        }
    }

    render() {
        return (
            <div id={this.props.id} className={this.props.className} ref={this.setWrapperRef}>
                {this.props.children}
            </div>
        );
    }
}

export {Autocomplete}