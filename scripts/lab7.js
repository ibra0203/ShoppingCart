/*

*/
var shopping = ( function()
{
    var imgPath = "img/";
    
    var brands = []; //array of brands
    brands.push({brand: "Extra", price: 1.50, img: "gum1.jpg"});
    brands.push({brand: "Doublemint", price: 1.00, img: "gum2.jpg" });
    brands.push({brand: "Trident", price: 1.20, img: "gum3.jpg" });
    brands.push({brand: "Bubble Gum", price: 1.30, img: "gum4.jpg" });
    
    var currentItem =0; //current item from the shopping list
    
    var imgDisplay = document.getElementsByClassName("imgDisplay")[0];
    var imgs = [];
    var productBrand = document.getElementById("dBrand");
    var productPrice = document.getElementById("dPrice");
    var cartElement = document.getElementById("cart");
    var cartItems =[];
    var qtnInput = document.getElementById("productQTN").cloneNode(true);
    var cartSubtotal = document.getElementById("cart-subtotal");
    var cartFooter = document.getElementsByTagName("TFOOT")[0];
    function _changeDisplayPic(toIndex)
    {
        imgs[currentItem].classList.toggle("visible");
        currentItem = toIndex;
        imgs[currentItem].classList.toggle("visible");
        _updateProductDisplay();
    }
    
    function _init()
    {
        
        var i;
        for(i=0; i<brands.length;i++)
        {
            _img= document.createElement("IMG");
            _img.setAttribute("src", imgPath+brands[i].img);
            if(i == currentItem) _img.classList.toggle("visible");
            imgs.push(_img);
            imgDisplay.appendChild(_img);
        }
        _updateProductDisplay();
        qtnInput.removeAttribute("id");
        _updateCartFooter();
        
        
    }
    function _updateCartFooter()
    {
        if(cartItems.length>0)
        {
            var _total =0;
            var i;
            for(i=0; i<cartItems.length;i++)
            {
                _total += cartItems[i].subtotal();        
            }
            cartSubtotal.innerHTML ="C$"+ _total.toPrecision(3);
            cartFooter.style.opacity="1";
            cartFooter.style.pointerEvents ="auto";
            
        }
        else
        {
            cartFooter.style.opacity="0";
            cartFooter.style.pointerEvents ="none";
        }
    }
    function _updateProductDisplay()
    {
        productBrand.innerHTML = brands[currentItem].brand;
        productPrice.innerHTML = "C$ "+brands[currentItem].price;
        displayHandler.resetQtn();
    }
    
    function _addItemToCart(_qtn)
    {
        _brand = brands[currentItem];
        var _item ={
          brand: _brand.brand,
          price: _brand.price,
          img: _brand.img,
          quantity: _qtn,
        };
        
        _item.subtotal = function() {
            return this.price * this.quantity;
        };
        
        cartItems.push(_item);
    }
    
    function _removeItemFromCart(_btn){
        _brand = _btn.getAttribute("data-brand");
        var i;
        for(i=0; i<cartItems.length;i++){
            if(cartItems[i].brand == _brand){
                cartItems.splice(i,1);
                break;
            }
        }
    
        
    }
    return{
        
        changeItem: function(dir)
        {
            //get if it's forward or backwards, then correct if outside array bounds
           dir = currentItem + dir;
            if(dir < 0) dir = brands.length-1;
            else if(dir> brands.length-1) dir = 0;
           _changeDisplayPic(dir);
        },
        
        init: function()
        {
            _init();
        },
        getCurrentShopItem: function()
        {
            return brands[currentItem];
        },
        removeItem: function(_btn)
        {
            _removeItemFromCart(_btn);
            this.updateCart();
        },
        
        addPrice: function()
        {
            var _qtn = displayHandler.getShopQtn();
            var foundItemI =-1;
            var i;
            for(i=0;i<cartItems.length;i++) //Search if Item already exists
            {
                if(cartItems[i].brand == brands[currentItem].brand)
                {
                    foundItemI=i; //found item
                    break;
                }
                    
            }
            if(foundItemI == -1) //didn't find item, can add to cart
            {
                
                _addItemToCart(_qtn);
                 displayHandler.resetQtn();
            }
            else
                displayHandler.setWarningText("Warning: Item is already in cart"); //display warning
            
            this.updateCart();
           
           
        },
        
        updateCart:function()
        {
            //clear the table then replace with updated info
            this.clearCart();
            var i;
            for(i=0 ; i<cartItems.length; i++)
            {
                
                _item = cartItems[i];
               newTr = document.createElement("TR");
               _html=" "
               tdStart = "<td>";
                tdEnd="</td>";
                _html += tdStart + "<a href=\"\" class=\"removeBtn\" ><img src =\"img/removeBtn.png\"> </a>"+tdEnd;
                _html +=tdStart + "<img src=\"" +imgPath+_item.img+"\">"+tdEnd;
                mid =_item.brand; 
                _html+=tdStart+mid+tdEnd;    
                
                mid="C$"+(_item.price).toPrecision(3);
                _html +=tdStart+mid+tdEnd;
                mid ="C$"+_item.subtotal().toPrecision(3);
                _html += tdStart+mid+tdEnd;
                var _qtnCounter = qtnInput.cloneNode(true);
                
                _qtnCounter.getElementsByClassName("qntSelector")[0].value = _item.quantity;
                
                _qtnCounterTD = document.createElement("TD");
                _qtnCounterTD.appendChild(_qtnCounter);
                
                newTr.innerHTML = unescape(_html);
                newTr.insertBefore(_qtnCounterTD, newTr.lastChild);
                _qtnCounter.setAttribute("data-brand", _item.brand); //identify the counter with a custom HTML tag
                newTr.getElementsByClassName("removeBtn")[0].setAttribute("data-brand", _item.brand); //identify the remove button with a custom HTML tag
                
                //register event listeners for the new quantity buttons and remove button
                inputHandler.registerListenerForClass("removeBtn", newTr);
                inputHandler.registerListenerForClass("valuebutton", newTr);
                
                //add new row to body
                cartElement.getElementsByTagName("TBODY")[0].appendChild(newTr);

            }
            _updateCartFooter();
                 
        },
        
        clearCart:function()
        {
            _cols = cartElement.getElementsByTagName("TBODY")[0];
            _cols.innerHTML=" ";
            
            
        },
        
        removeAllItems:function()
        {
            this.clearCart();
            cartItems.splice(0, cartItems.length);
            this.updateCart();
        },
        
        updateItemQtn: function(_qtn, _parent)
        {
            _itemBrand = _parent.getAttribute("data-brand");
            var i;
            for(i=0; i<cartItems.length; i++)
            {
                if(_itemBrand == cartItems[i].brand)
                {
                    cartItems[i].quantity = _qtn;  
                    break;
                }
            }
            this.updateCart();
        }   
    };

    
}());

var inputHandler = ( function()
{
    
    return{
        handleEvent: function(e)
        {
            switch(e.type)
                {
                case "click":
                
                    displayHandler.resetWarningText();

                    _class =e.target.className;
                    _id = e.target.id;
                    if(_id == "add-price")
                        shopping.addPrice();  

                    if(_class=="removeBtn")
                        shopping.removeItem(e.target);

                    if(_class =="valuebutton decrease" )
                        displayHandler.changeQtn(e, -1);
                    else if(_class =="valuebutton increase")
                        displayHandler.changeQtn(e, 1);
                    
                    if(_class=="prod-nav-btn")
                    {
                        var _dir = parseInt(e.target.getAttribute("data-dir"));
                        shopping.changeItem(_dir);
                    }
                    if(_id=="clear-button")
                    {
                        var _confirmClear = confirm("Are you sure you want to clear cart?");
                        if(_confirmClear)    
                        shopping.removeAllItems();
                    }
               
                break;
                }
        },
        init:function()
        {
            document.getElementById("add-price").addEventListener("click", this);
            this.registerListenerForClass("valuebutton");
            this.registerListenerForClass("prod-nav-btn");
            this.registerListenerForID("clear-button");
        }
        ,
        
        registerListenerForClass:function(_class, _root=document, _event="click")
        {
            var _objs=_root.getElementsByClassName(_class);
           
            var i;
            for(i=0; i<_objs.length;i++)
            {
                _objs[i].addEventListener(_event, this);
            }
        } ,
        registerListenerForID:function(_ID, _event="click")
        {
            var _obj=document.getElementById(_ID);
            _obj.addEventListener(_event, this);
        } 
    };
}());
var displayHandler = ( function()
{
    var minQtn = 1;
    var maxQtn = 9;
    var shopQtn;
    var shopQtnDisplay = document.getElementById("productQTN").getElementsByClassName("qntSelector")[0];
    var shopSubtotal = document.getElementById("dSubtotal");
    var displayItem;
    var warningTxt = document.getElementById("error-msg");
    return{
            init:function()
            {
                this.resetQtn();
            },
            changeQtn: function(evnt, amount)
            {
                var _num = evnt.target.parentElement.getElementsByTagName("INPUT")[0];
                var _newNum;
                if(parseInt(_num.value) +amount < minQtn)
                {
                    _newNum = minQtn;
                    _wrn="Warning: You can't choose less than 1 item";
                    this.setWarningText(_wrn);
                }
                else if (parseInt(_num.value) +amount > maxQtn )
                {
                    _newNum = maxQtn;
                    _wrn="Warning: Only " +String(maxQtn)+" items are left of this product";
                    this.setWarningText(_wrn);
                }
                else
                    _newNum = parseInt(_num.value) +amount;

                _num.value = _newNum;

                var _parent = evnt.target.parentElement;
                if(_parent.id == "productQTN")
                {

                    shopQtn = _newNum;
                    this.updateShopQtn();
                }
                else
                {
                    shopping.updateItemQtn(_newNum, _parent);        
                }

            },
            resetQtn: function(){
                shopQtn=1;
                shopQtnDisplay.value = shopQtn;
                this.updateShopQtn();

            },
            updateShopQtn: function()
            {
                displayItem = shopping.getCurrentShopItem();
                shopSubtotal.innerHTML="Subtotal: " + "C$" + (shopQtn * displayItem.price).toPrecision(3);
            },
            getShopQtn: function()
            {
                return shopQtn;
            },
            setWarningText: function(_text)
            {
                warningTxt.innerHTML =_text;
            },
            resetWarningText: function()
            {
                warningTxt.innerHTML = " ";
            }
    };
}());


shopping.init();
inputHandler.init();
displayHandler.init();
