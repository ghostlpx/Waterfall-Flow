$( function(){
	var oContainer = $('#container');
	var oLoader = $('#loader');
	var iCell = 0;
	var iWidth = 200;
	var iSpace = 10;
	var iPage = 0;
	var iOuterWidth = iWidth+iSpace;
	var arrT = [];
	var arrL = [];
	var sUrl = 'http://www.wookmark.com/api/json/popular?callback=?';
	var onOff = true;
	
	function setCell () {
		iCell = Math.floor($(window).innerWidth() / iOuterWidth);
		//document.title = iCell;
		
		//限制列数
		if(iCell < 3){
			iCell = 3;
		}
		if(iCell > 8){
			iCell = 8;
		}
		
		oContainer.css('width',iOuterWidth*iCell-iSpace);
	}
	setCell();
	
	for( var i=0; i<iCell; i++ ){
		arrL.push(i*iOuterWidth);
		arrT.push(0);
	}
	
	//通过json进行数据加载
	function getData () {
		if(onOff){	//如果本次没有加载完成，不进行下次加载
			onOff = false;
			oLoader.show();
			$.getJSON(sUrl, 'page='+iPage, function(data){
				$.each(data, function(index,obj) {
					var oImg = $('<img />');
					oImg.attr('src', obj.preview);
					oContainer.append(oImg);
					
					//提前算出oImg的高度
					var iHeight = (iWidth/obj.width)*obj.height;
					oImg.css({
						width:iWidth,
						height:iHeight
					});
					
					//找到top值最小的oImg，然后将新一张图片放到其下面
					var iMinIndex = getMin();
					oImg.css( {
						left:arrL[iMinIndex],
						top:arrT[iMinIndex]
					} );
					
					arrT[iMinIndex] += iHeight+10;
					//加载完成后，loader隐藏
					oLoader.hide();
					onOff = true;
				});
			});
		}
	}
	
	getData();
	
	//移动滚动条，当滚动距离与可视区高之和大于当前最小top值图片时，要加载新图片
	$(window).on('scroll',function(){
		var iH = $(window).innerHeight()+$(window).scrollTop();
		var iMin = getMin();
		if( arrT[iMin]+oContainer.offset().top < iH ){
			iPage++;
			getData();
		}
	});
	
	$(window).on('resize', function(){
		var oldCells = iCell;
		setCell();
		
		//如果由于缩小比例后出现空白，则要继续加载图片进行补充
		var iH = $(window).innerHeight()+$(window).scrollTop();
		var iMin = getMin();
		if( arrT[iMin]+oContainer.offset().top < iH ){
			iPage++;
			getData();
		}
		
		//如果列数没有发生变化则不进行重新布局
		if( iCell == oldCells ){
			return;
		}
		arrL = [];
		arrT = [];
		for( var i=0; i<iCell; i++ ){
			arrL.push(i*iOuterWidth);
			arrT.push(0);
		}
		var aImgs = oContainer.find('img');
		
		//相当于将现有已加载完的图片进行重新布局
		aImgs.each(function(){
			/*$(this).css({
				left:arrL[iMinIndex],
				top:arrT[iMinIndex]
			});*/
			var _index = getMin();
			$(this).animate({
				left:arrL[_index],
				top:arrT[_index]
			},1000);
			arrT[_index] += $(this).height()+10;
		});
		
	});
	
	
	function getMin(){
		var iMin = arrT[0];
		var _index = 0;
		for( var i=1; i<arrT.length; i++ ){
			if( arrT[i] < iMin ){
				iMin = arrT[i];
				_index = i;
			}
		}
		return _index;
	}
	
} );