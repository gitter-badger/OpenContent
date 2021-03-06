#region Copyright

// 
// Copyright (c) 2015
// by Satrabel
// 

#endregion

#region Using Statements

using System;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Common;
using DotNetNuke.Framework.JavaScriptLibraries;
using DotNetNuke.Framework;
using Satrabel.OpenContent.Components;


#endregion

namespace Satrabel.OpenContent
{

	public partial class EditSettings : PortalModuleBase
	{

		#region Event Handlers

		protected override void OnInit(EventArgs e)
		{
			base.OnInit(e);
            hlCancel.NavigateUrl = Globals.NavigateURL();
            //cmdSave.NavigateUrl = Globals.NavigateURL();

			//cmdSave.Click += cmdSave_Click;
			//cmdCancel.Click += cmdCancel_Click;
            
            ServicesFramework.Instance.RequestAjaxScriptSupport();
            ServicesFramework.Instance.RequestAjaxAntiForgerySupport();
            //JavaScript.RequestRegistration(CommonJs.DnnPlugins); ;
            //JavaScript.RequestRegistration(CommonJs.jQueryFileUpload);

            //DotNetNuke.UI.Utilities.ClientAPI.RegisterClientVariable(Page, "PortalId", PortalId.ToString(), true);
            //CKDNNporid.Value = PortalId.ToString();
		}

		protected override void OnLoad(EventArgs e)
		{
			base.OnLoad(e);
			
			if (!Page.IsPostBack)
			{
                var scriptFileSetting = Settings["template"] as string;
                scriptList.Items.AddRange(OpenContentUtils.GetTemplatesFiles(PortalSettings, ModuleId, scriptFileSetting).ToArray());
			}
		}
		
		protected void cmdSave_Click(object sender, EventArgs e)
		{
            ModuleController mc = new ModuleController();
            mc.UpdateModuleSetting(ModuleId, "template", scriptList.SelectedValue);
            mc.UpdateModuleSetting(ModuleId, "data", HiddenField.Value);
            Response.Redirect(Globals.NavigateURL(), true);
            //DotNetNuke.UI.Skins.Skin.AddModuleMessage(this, "Update Successful", DotNetNuke.UI.Skins.Controls.ModuleMessage.ModuleMessageType.GreenSuccess);
		}


		protected void cmdCancel_Click(object sender, EventArgs e)
		{
		}

		#endregion


	}
}

