		app.controller(
				'homeController',
				function($scope, $http, $location, $localStorage) {
					
					$scope.cart=[];
					/*if(JSON.parse(localStorage.getItem('cart'))!=null)
						{
						$scope.cart=JSON.parse(localStorage.getItem('cart'));
						}*/
					$scope.enableCheckout = 0;
					/*if(localStorage.getItem('enableCheckout')!=null)
					{
						$scope.enableCheckout=parseInt(localStorage.getItem('enableCheckout'),10);
					}*/
					
					$scope.totalPrice=0;
					/*if(localStorage.getItem('totalPrice')!=null)
					{
						$scope.totalPrice=parseInt(localStorage.getItem('totalPrice'),10);
					}*/
					$scope.yourOrders=[];
					if(JSON.parse(localStorage.getItem('yourOrders'))!=null)
					{
					$scope.yourOrders=JSON.parse(localStorage.getItem('yourOrders'));
					}
					
					
					let Order = function(name, totalAmount, orderItems, status, isCancellable )
					{
						this.name= name;
						this.totalAmount= totalAmount
						this.orderItems = orderItems;
						this.isCancellable=isCancellable;
						this.status = status;
					}
					
					let Items = function(name,quantity,price,family)
					{
						this.name = name;
						this.quantity = quantity;
						this.price = price;
						this.family = family;
						this.basePrice = price;
						this.setPrice=function()
						{
							this.price= (this.quantity)*(this.basePrice);
						};
						this.increaseQuantity=function()
						{
							this.quantity+=1;
						};
						this.decreaseQuantity=function()
						{
							this.quantity-=1;
						}
						
	
					}
					
					$http
							.get("https://demo6528052.mockable.io/getAllItems")
							.success(
									function(data) {
										$scope.unfilteredFoodList = data;
										$scope.filteredFoodList = angular
												.copy($scope.unfilteredFoodList);
										$scope.highlyFilteredFoodList = angular
												.copy($scope.filteredFoodList);
										console.log($scope.foodList);
									}).error(function() {
								alert("error");
							})
					

					$scope.addItems= function(item,index,flag)
					{
						/*if($scope.cart[$scope.filteredFoodList[$scope.parentIndex].name]==undefined)
							{
							$scope.cart[$scope.filteredFoodList[$scope.parentIndex].name]=[];
							}
						if($scope.cart[$scope.filteredFoodList[$scope.parentIndex].name][0].type!=item.type)
							{
						let foodItem = new Items($scope.filteredFoodList[$scope.parentIndex].name,item.type,item.price);
						item.quantity==0;
						$scope.cart[$scope.filteredFoodList[$scope.parentIndex].name].push(foodItem);
							}*/
						item.quantity+=1;
						if(item.quantity==1)
							{
							$scope.cart.push(new Items(item.name,item.quantity,item.price,$scope.family));
							$scope.totalPrice+= item.price;
						
							 
							}
						else
							{
							for(let i=0;i<$scope.cart.length;i++)
								{
								if($scope.cart[i].name==item.name)
									{
									if(!(flag=="C"))
									$scope.cart[i].increaseQuantity();
									
									$scope.cart[i].setPrice();
									$scope.totalPrice+= $scope.cart[i].basePrice;
									
								}
								}
							}
						$scope.enableCheckout+=1;
						localStorage.setItem('totalPrice', $scope.totalPrice);
						 localStorage.setItem('enableCheckout', $scope.enableCheckout);
						document.getElementById("cartCount").value=$scope.enableCheckout;
						console.log($scope.enableCheckout);
						console.log($scope.cart);
					}
					
					
					$scope.applyFilter=function()
					{
						$scope.filteredFoodList = $scope.unfilteredFoodList
						.filter(function(item) {
							if (item.name.toUpperCase().includes(
									$scope.searchItem.toUpperCase()
											.trim())) {
								return item;
							} else {
								item.type
										.filter(function(typeItem) {
											if (typeItem.name
													.toUpperCase()
													.includes(
															$scope.searchItem.toUpperCase())) {
												$scope.filteredFoodList.push(item);
												return typeItem;
											}
										});
							}
						});
					}
					
					$scope.deleteItems= function(item,index,flag)
					{
						
						if(item.quantity>0)
							{ 
							
						item.quantity-=1;
						$scope.enableCheckout-=1;
						
						if(!(flag=="C"))
						$scope.totalPrice-= item.price;
						
						else
							$scope.totalPrice-= item.basePrice;
						
						document.getElementById("cartCount").value=$scope.enableCheckout;
						for(let i=0;i<$scope.cart.length;i++)
						{
						if($scope.cart[i].name==item.name)
							{
							if(item.quantity==0)
								{
								$scope.cart.splice(i,1);
			
			localStorage.setItem('enableCheckout', $scope.enableCheckout);
								
								localStorage.setItem('totalPrice', $scope.totalPrice);
								}
							else{
								if(!(flag=="C"))
								$scope.cart[i].decreaseQuantity();
								$scope.cart[i].setPrice();
			
								localStorage.setItem('enableCheckout', $scope.enableCheckout);
								
								localStorage.setItem('totalPrice', $scope.totalPrice);
							}
							}
						}
							}
						
						console.log($scope.totalPrice);
						
					}
					
					$scope.cancel=function(item)
					{
						swal({
							  title: "Are you sure?",
							  text: "Your order will no longer be active!",
							  type: "warning",
							  showCancelButton: true,
							  confirmButtonClass: "btn-danger",
							  confirmButtonText: "Yes, Cancel it!",
							  closeOnConfirm: false
							}).then(
							function(){
								$scope.isCancellable=false;
							  swal("Cancelled!", "Your order is cancelled", "success");
							  
								  console.log(yourOrders);
							});
						if(!($scope.isCancellable))
							{
						item.isCancellable=$scope.isCancellable;
						  item.status="Cancelled!!"
							  localStorage.setItem('yourOrders', JSON.stringify($scope.yourOrders));
							}
					}
					
				/*	$scope.clear=function()
					{
						
						for(let i=0;i<$scope.specificFoodList.length;i++)
							{
							
							$scope.enableCheckout-=$scope.specificFoodList[i].quantity;
							$scope.specificFoodList[i].quantity= 0;
							console.log($scope.specificFoodList);
							}
						for(let i=0; i< $scope.cart.length; i++)
						{
						if($scope.cart[i].family==$scope.family)
							{
							$scope.cart.splice(i,1);
							}
						}
					}*/
					
					$scope.placeOrder = function()
					{	
						
					swal("Give your order a name", {
						  content: "input",
						})
						.then((inputValue) => {
							
							  if (inputValue === false) return false;
							  if (inputValue === "") {
								
								  swal("Error!","Order name is mandatory","error");
							  }
							    else{
							    
							let status= 'Confirmed, Your Order will be delivered to you within x minutes';
						
							$scope.yourOrders.push(new Order(inputValue, $scope.totalPrice, $scope.cart , status, true));
							
							$scope.yourOrders.map((item,index,arr)=>
							{
								if(item.status!="Cancelled!!" && index!=(arr.length-1))
									{
									item.status="Completed"
										item.isCancellable=false;
									}
	
							});
							
							localStorage.setItem('yourOrders', JSON.stringify($scope.yourOrders));	
							swal("Great!",`Your order has been placed`,"success").then(function()
									{

								$scope.cart=[];
								
								$scope.enableCheckout=0;
								
								
							  
							  $scope.totalPrice=0;
							  localStorage.setItem('totalPrice', $scope.totalPrice);
							  /*$scope.filteredFoodList = angular
								.copy($scope.unfilteredFoodList);*/
							  
							  document.getElementById('orders').click();
							  
									});
							
						
						  
						  
							    }
							
						});
					
					console.log($scope.yourOrders);
							  
						
						
					}
					
					$scope.search = function() {
						$scope.searchItem=document.getElementById("searchBox").value.trim();
						if (($scope.searchItem.trim() != null
								|| $scope.searchItem.trim() != "" || $scope.searchItem
								.trim() != undefined)
								&& $scope.searchItem.trim().length >= 3) {
							console.log($scope.filteredFoodlist);
							$scope.filteredFoodList = [];
							$scope.filteredFoodList = $scope.unfilteredFoodList
									.filter(function(item) {
										if (item.name.toUpperCase().includes(
												$scope.searchItem.toUpperCase()
														.trim())) {
											return item;
										} 
									});
						console.log($scope.filteredFoodList);
						} else if ($scope.searchItem.trim() == "") {
							$scope.filteredFoodList = angular
									.copy($scope.unfilteredFoodList);

						}

					}
					
					$scope.orderHistory= function()
					{
						$location.url("/orders");
					}
					
					$scope.checkout = function()
					{
						$('selectionSpecific').modal('hide');
						$('body').removeClass('modal-open');
						$('.modal-backdrop').remove();
				

						$location.url("/cart");
					}

					$scope.selection = function(item, index) {
						$scope.parentIndex= index;
						$scope.selectionHeading = `${item.name} selection`;
						$scope.specificFoodList = item.type;
						$scope.family= item.name;
						for(var i=0; i<$scope.cart.length;i++)
							{
						if($scope.cart[i].family==$scope.family)
							{
							for(let j=0;j<$scope.specificFoodList.length;j++)
								{
								if($scope.cart[i].name==$scope.specificFoodList[j].name)
									{
									$scope.specificFoodList[j].quantity=$scope.cart[i].quantity;
									
									}
								}
							}
							}
					}

				});