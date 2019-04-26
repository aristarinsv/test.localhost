
$(function() {

    $("#tabs").tabs({            
			activate: function( event, ui ) {
					getAjax(ui.newPanel.selector);
			},
			create: function( event, ui ) {
					getAjax(ui.panel.selector);
			}
		});

		$("#tabs-2 button").click(function(){ 
			getAddAjax($("#fio").val());
		});

		$("#fio").on('keydown', function(event){
			if(event.which == 13){
				getAddAjax($("#fio").val());
			}
		})
		
		$("#tabs-1 button").click(function(){ 
			getAjax("#tabs-1");
		});
		
		$("#search").on('keydown', function(event){
			if(event.which == 13){
				getAjax("#tabs-1");
			}
		})

		function getAjax(sel){
			if(sel == "#tabs-1") {
				var search = $("#search").val();
				$("#myTable .ui-widget-content").children().remove();
				$.get("api/users", {"name_like": search}, function(data) {
					addTableData(data);
				}, "json");
			}
			if(sel == "#tabs-2") {
				$.get("api/users", function(data) {
					$("#myEditTable .ui-widget-content").children().remove();
					addTableEditData(data);
				}, "json");

			}
		}

		function getEditAjax(id, field, val){
			$.ajax({
				url: "api/update/"+id +"?fieldname=" + field + "&val="+val,
				type: 'PUT',
				data: {type: "edit"},
				success: function(data) {
					$('.ajax').html(val);
					$('.ajax').removeClass('ajax');
				   $('.ajax input').remove();
				},
			  });			
		}

		function getDelAjax(id){
			$.ajax({
				url: "api/delete/"+id,
				type: 'DELETE',
				data: {type: "del"},
				success: function(data) {
					getAjax("#tabs-2");
				},
			  });			
		}

		function getAddAjax(val){
			$.ajax({
				url: "api/create?fio=" + val,
				type: 'POST',
				data: {type: "create"},
				success: function(data) {
					getAjax("#tabs-2");
					$("#fio").val('');
				},
			  });			
		}

		function addTableData(data){
			var tr;
			$.each(data, function(k, v) {
				tr = $("<tr></tr>");
				tr.append("<td>" + v.idusers + "</td>");
				tr.append("<td>" + v.usersname + "</td>");
				tr.append("<td>" + v.usersstatus + "</td>");
				$("#myTable .ui-widget-content").append(tr);
			});
		}


		function addTableEditData(data){
			var tr;
			$.each(data, function(k, v) {
				tr = $("<tr></tr>");
				tr.append("<td>" + v.idusers + "</td>");
				tr.append("<td class='edit usersname " + v.idusers + "'>" + v.usersname + "</td>");
				tr.append("<td class='edit usersstatus " + v.idusers + "'>" + v.usersstatus + "</td>");
				tr.append("<td class='del'><a class='" + v.idusers + "' title='Удалить запись' href='#'>&#10006;</a></td>");
				$("#myEditTable .ui-widget-content").append(tr);
			});
		}

		$("#myEditTable .ui-widget-content").on('click', "td.edit", function(){
			$('.ajax').html($('.ajax input').val());
			$('.ajax').removeClass('ajax');
			$('.ajax input').remove();
			$(this).addClass('ajax');
			$(this).html('<input id="editbox" size="'+ $(this).text().length+'" type="text" value="' + $(this).text() + '" />');
			$('#editbox').focus();
		});

		$("#myEditTable .ui-widget-content").on('click', "td.del a", function(){
			if( confirm('Вы действительно хотите удалить запись?') ) {
				var arr = $(this).attr('class').split( " " );
				getDelAjax(arr[0]);
			}
		});


		$("#myEditTable .ui-widget-content").on('keydown', "td.edit", function(event){
			var arr = $(this).attr('class').split( " " );
			var val = $('.ajax input').val();
			if(event.which == 13)
			{
				getEditAjax(arr[2], arr[1], val);
			}
		});

});
