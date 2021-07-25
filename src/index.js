
import _ from 'lodash';

 function component() {
   const element = document.createElement('div');

   const blah = 'yoyo4'

   element.innerHTML = _.join(['Hello', 'webpack', `${blah}`, 6], ' ');
   

   return element;
 }

 document.body.appendChild(component());
