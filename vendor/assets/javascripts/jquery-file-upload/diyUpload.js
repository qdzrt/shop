/* 
*	jQuery文件上传插件,封装UI,上传处理操作采用Baidu WebUploader;
*	@Author 黑爪爪;
*/
var attachment_mode;
(function( $ ) {
	
    $.fn.extend({
		/*
		*	上传方法 opt为参数配置;
		*	serverCallBack回调函数 每个文件上传至服务端后,服务端返回参数,无论成功失败都会调用 参数为服务器返回信息;
		*/
        diyUpload:function( opt, serverCallBack ) {
 			if ( typeof opt != "object" ) {
				alert('参数错误!');
				return;	
			}
			
			var $fileInput = $(this);
			var $fileInputId = $fileInput.attr('id');

			 // 添加的文件数量
			var fileCount = 0;
			//获得指定选择文件的按钮容器的id
			var optid;
			
			//组装参数;
			if( opt.url ) {
				opt.server = opt.url; 
				delete opt.url;
			}
			
			if( opt.success ) {
				var successCallBack = opt.success;
				delete opt.success;
			}
			
			if( opt.error ) {
				var errorCallBack = opt.error;
				delete opt.error;
			}
			
			//迭代出默认配置
			$.each( getOption( '#'+$fileInputId ),function( key, value ){
					opt[ key ] = opt[ key ] || value; 
			});
			
			if ( opt.buttonText ) {
				opt['pick']['label'] = opt.buttonText;
				delete opt.buttonText;	
			}
			
			var webUploader = getUploader( opt );
			
			if ( !WebUploader.Uploader.support() ) {
				alert( ' 上传组件不支持您的浏览器！');
				return false;
       		}
			
			//绑定文件加入队列事件;
			webUploader.on('fileQueued', function( file ) {
				createBox( $fileInput, file ,webUploader);
			});
			
			// //当一批文件添加进队列以后触发
			// webUploader.on('uploadStart',function(file) {
			  // //判断是否展开
			    // //--------------------------
				// var file_id = file.id;
				// var complete_file = document.getElementById("fileBox_"+file_id);
			   // var stat =webUploader.getStats(); //获取webupload对象状态
			   // var sum_number_file = stat.successNum +stat.uploadFailNum - stat.cancelNum  //队列中的总数(总的成功的和失败的减取消去数量是现在列表中显示的数量)
			// });
			
			
			//进度条事件
			webUploader.on('uploadProgress',function( file, percentage  ){
				var $fileBox = $('#fileBox_'+file.id);
				var $diyBar = $fileBox.find('.diyBar');	
				$diyBar.show();
				percentage = percentage*100;
				showDiyProgress( percentage.toFixed(2), $diyBar);
				
			});
			
			//全部上传结束后触发;
			webUploader.on('uploadFinished', function(){
				$fileInput.next('.parentFileBox').children('.diyButton').remove();
			});
			//绑定发送至服务端返回后触发事件;
			webUploader.on('uploadAccept', function( object ,data ){
				if ( serverCallBack ) serverCallBack( data );
			});
			
			webUploader.on('uploadSuccess',function( file, response ){
				var file = file;
				var file_id = file.id;
				var $fileBox = $('#fileBox_'+file.id);
				var $diyBar = $fileBox.find('.diyBar');
			   var file_name = file.name;
			   var optid = opt.pick.id ;
			   var stat =webUploader.getStats(); //获取webupload对象状态
			   var sum_number_file = stat.successNum +stat.uploadFailNum - stat.cancelNum  //队列中的总数(总的成功的和失败的减取消去数量是现在列表中显示的数量)
			   
				//$fileBox.removeClass('diyUploadHover');
				$diyBar.fadeOut( 1000 ,function(){
				//$fileBox.children('.diySuccess').show();
				
				//=====上传文件成功的回调函数开始
			  if ( successCallBack ) {
				successCallBack( response );
				var time_stamp_file_name = response._raw;
				var obj_file_name = document.getElementById(file_name);
				
				obj_file_name.value =time_stamp_file_name; //为要上传的文件添加事件戳
				}
				//====上传文件成功的回调函数结束
				
				//添加一个上传成功后，可以删除的操作
				$fileBox.children('.diyCancel').one('click',function(){
					//判断上传文件是否小于限制数值，小于则显示加号
					if (sum_number_file < opt.fileNumLimit){
				   //设置加号显示
				   	$(optid).css('display', 'block');
					}	
							//与服务器通信删除已经上传到服务器的文件===
								$.ajax({
									url:"/ajax/del_upload_file",
									data: "file_name="+time_stamp_file_name,
					            method: "get",				
					            success: function(data,status) 
					              {
									} ,
									error: function(data, statusText){
									}
						    	});
						    //===========
				 removeLi( $(this).parent('li'), file, webUploader );
				//===
		
			    	});
				});
				
				

				});
			
			//上传失败后触发事件;
			webUploader.on('uploadError',function( file, reason ){
				var file = file;
				var file_id = file.id;
				var $fileBox = $('#fileBox_'+file.id);
				var $diyBar = $fileBox.find('.diyBar');	
				showDiyProgress( 0, $diyBar , '上传失败!' );
				var err = '上传失败! 文件:'+file.name+' 错误码:'+reason;
				
				var optid = opt.pick.id ;
			   var stat =webUploader.getStats(); //获取webupload对象状态
			   var sum_number_file = stat.successNum +stat.uploadFailNum - stat.cancelNum  //队列中的总数(总的成功的和失败的减取消去数量是现在列表中显示的数量)
				
				$fileBox.children('.diyCancel').one('click',function(){
					//判断上传文件是否小于限制数值，小于则显示加号
					if (sum_number_file < opt.fileNumLimit){
				   //设置加号显示
				   	$(optid).css('display', 'block');
					}			
			//与服务器通信删除已经上传到服务器的文件			
				$.ajax({
						url:"/ajax/del_upload_file",
						data: "file_name="+time_stamp_file_name,
		            method: "get",				
		            success: function(data,status) 
		              {
						} ,
						error: function(data, statusText){
						}
			    	});
			    //====
											
				 removeLi( $(this).parent('li'), file, webUploader );
				});
				
				if ( errorCallBack ) {
					errorCallBack( err );
				}
			});

		//文件计数
 		webUploader.onFileQueued = function( file ) {
				fileCount++;
		};
		webUploader.onFileDequeued = function( file ) {
				fileCount--;
		};

		webUploader.on("fileQueued",function (file) {
			var optid = opt.pick.id ;
			if (fileCount >= opt.fileNumLimit-1){
				//首页发布
				// document.getElementById('text_new_tweet_attachment_upload_div').style.display="none";
				// document.getElementById("text_new_tweet_image_upload_div").style.display="none";
				$(optid).css('display', 'none');
			}			
			
	 });
			
			
			//不管成功或者失败，文件上传完成时触发,用于处理上传文件数大于最大数时的隐藏处理
			webUploader.on("uploadComplete",function (file) {
				
				   //判断是否展开
				   //----------------
			   var file_id = file.id;
				var complete_file = document.getElementById("fileBox_"+file_id);
			   var stat =webUploader.getStats(); //获取webupload对象状态
			   var sum_number_file = stat.successNum +stat.uploadFailNum - stat.cancelNum;  //队列中的总数(总的成功的和失败的减取消去数量是现在列表中显示的数量)
					
					//var input_box = complete_file.parentNode.parentNode.lastChild;
					
					
			     //做判断，如果上传的文件数大于设置的最大文件数，则取消添加按钮
					if (sum_number_file==opt.fileNumLimit){
						//complete_file.parentNode.removeChild(document.getElementById("text_new_tweet_image_upload_div"))
						//首页发布
						//  document.getElementById("text_new_tweet_image_upload_div").style.display="none";
						 //document.getElementById('text_new_tweet_attachment_upload_div').style.display="none";
					}
					
			});

			
			//选择文件错误触发事件;
			webUploader.on('error', function( code ) {
				var text = '';
				switch( code ) {
					case  'F_DUPLICATE' : text = '该文件已经被选择了!' ;
					break;
					case  'Q_EXCEED_NUM_LIMIT' : text = '上传文件数量超过限制!' ;
					break;
					case  'F_EXCEED_SIZE' : text = '文件大小超过限制!';
					break;
					case  'Q_EXCEED_SIZE_LIMIT' : text = '所有文件总大小超过限制!';
					break;
					case 'Q_TYPE_DENIED' : text = '文件类型不正确或者是空文件!';
					break;
					default : text = '未知错误!';
 					break;	
				}
            	alert( text );
        	});

        }
    });
	
	
	
	function show_add_button(file)
	{
				var file_id = file.id;
				var complete_file = document.getElementById("fileBox_"+file_id);
			   var stat =webUploader.getStats(); //获取webupload对象状态
			   var sum_number_file = stat.successNum +stat.uploadFailNum - stat.cancelNum  //队列中的总数(总的成功的和失败的减取消去数量是现在列表中显示的数量)
					
					//var input_box = complete_file.parentNode.parentNode.lastChild;
					
					var attachment_mode="text_new_tweet_image_upload_div";
			     //做判断，如果上传的文件数大于设置的最大文件数，则取消添加按钮
					if (sum_number_file==opt.fileNumLimit){
						//complete_file.parentNode.removeChild(document.getElementById("text_new_tweet_image_upload_div"))
						document.getElementById(attachment_mode).style.display="block";
						//input_box.style.display="none"; 
					}
	}
	
	function off_add_button(file){
		
	}
	
	
	
	//Web Uploader默认配置;
	function getOption(objId) {
		/*
		*	配置文件同webUploader一致,这里只给出默认配置.
		*	具体参照:http://fex.baidu.com/webuploader/doc/index.html
		*/
		return {
			//按钮容器;
			pick:{
				id:objId,
				//图片
				//label: 	"图片"
			},
			//类型限制;
			 // accept:{
				 // title:"Images",
				 // extensions:"gif,jpg,jpeg,bmp,png",
				 // mimeTypes:"image/*"
			 // },
			//配置生成缩略图的选项
			thumb:{
				width:75,
				height:75,
				// 图片质量，只有type为`image/jpeg`的时候才有效。
				quality:70,
				// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
				allowMagnify:false,
				// 是否允许裁剪。
				crop:true,
				// 为空的话则保留原有图片格式。
				// 否则强制转换成指定的类型。
				type:"image/jpeg"
			},
			//文件上传方式
			method:"POST",
			swf:"../assets/javascripts/index/Uploader.swf",
			//服务器地址; 
			server:"",
			//是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容
			sendAsBinary:false,
			// 开起分片上传。 thinkphp的上传类测试分片无效,图片丢失;
			chunked:true,
			// 分片大小
			chunkSize:50*1024*1024,
			
			//是否允许在文件传输时提前把下一个文件准备好
			prepareNextFile:true ,
			//允许自动上传
			auto:true,
			//最大上传的文件数量, 总文件大小,单个文件大小(单位字节); 50 * 1024 *1024 =50M
			fileNumLimit:9,
			fileSizeLimit:100 * 1024 *1024,
			fileSingleSizeLimit:100 * 1024 *1024
		};
	}
	
	//实例化Web Uploader
	function getUploader( opt ) {

		return new WebUploader.Uploader( opt );
	}
	
	//操作进度条;
	function showDiyProgress( progress, $diyBar, text ) {
		
		if ( progress >= 100 ) {
			progress = progress + '%';
			text = text || '上传完成';
		} else {
			progress = progress + '%';
			text = text || progress;
		}
		
		var $diyProgress = $diyBar.find('.diyProgress');
		var $diyProgressText = $diyBar.find('.diyProgressText');
		$diyProgress.width( progress );
		$diyProgressText.text( text );
	
	}
	
	//取消事件;	//添加第二个参数为 true 会从 queue 中移除，计算总文件数。
	function removeLi ( $li ,file_id ,webUploader) {
		webUploader.removeFile( file_id ,true );
		if ( $li.siblings('li').length <= 0 ) {
			$li.parents('.parentFileBox').remove();
		} else {
			$li.remove();
		}
		
	}
	
	//创建文件操作div;	
	function createBox( $fileInput, file, webUploader ) {
		var file = file ; 
		var file_id = file.id;
		//var $parentFileBox = $fileInput.parent().parent().next('.parentFileBox');
		var $parentFileBox = $fileInput.parent().parent('.parentFileBox');
		//添加子容器;
		var li = '<li id="fileBox_'+file_id+'" class="diyUploadHover"> \
					<div class="viewThumb"></div> \
					<div class="diyCancel"></div> \
					<div class="diySuccess"></div> \
					<div class="diyFileName">'+file.name+'</div>\
					<input type="hidden" id="'+file.name+'" name="fileBox_'+file_id+'"  value="'+file.name+'" /> \
					<div class="diyBar"> \
							<div class="diyProgress"></div> \
							<div class="diyProgressText">0%</div> \
					</div> \
				</li>';
				
		$parentFileBox.children('.fileBoxUl').prepend( li );
		
		//父容器宽度;
		var $width = $('.fileBoxUl>li').length * 90;
		var $maxWidth = $parentFileBox.width()+0;
		$width = $maxWidth > $width ? $width : $maxWidth;
		$parentFileBox.width( $width );
		
		var $fileBox = $parentFileBox.find('#fileBox_'+file_id);

		//绑定取消事件;
		var $diyCancel = $fileBox.children('.diyCancel').one('click',function(){
			removeLi( $(this).parent('li'), file, webUploader );								
		});
		
		if ( file.type.split("/")[0] != 'image' ) {
			var liClassName = getFileTypeClassName( file.name.split(".").pop() );
			$fileBox.addClass(liClassName);
			return;	
		}
		
		//生成预览缩略图
		webUploader.makeThumb( file, function( error, dataSrc ) {
			if ( !error ) {	
				$fileBox.find('.viewThumb').append('<img src="'+dataSrc+'" >');
			}
		});	
	}
	
	//获取文件类型;
	function getFileTypeClassName ( type ) {
		var fileType = {};
		var suffix = '_diy_bg';
		fileType['pdf'] = 'pdf';
		fileType['zip'] = 'zip';
		fileType['rar'] = 'rar';
		fileType['csv'] = 'csv';
		fileType['doc'] = 'doc';
		fileType['xls'] = 'xls';
		fileType['xlsx'] = 'xls';
		fileType['txt'] = 'txt';
		fileType = fileType[type] || 'txt';
		return 	fileType+suffix;
	}
	
})( jQuery );